-- ============================================================================
-- MODEL DRIVING ACADEMY — ADVANCED RATE LIMITING, AUDIT & SECURITY SYSTEM
-- ============================================================================

-- 1. Rate Limiting Table (Atomic, Concurrency-Safe)
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE, -- e.g. 'login:account:ow***@modeldriving.in' or 'login:ip:127.0.0.1'
    action TEXT NOT NULL,      -- 'login', 'otp_gen', 'otp_verify', 'pwd_reset', 'recovery'
    identifier TEXT NOT NULL,  -- Masked or hashed identifier
    ip_address TEXT,
    attempts INT NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    window_expires_at TIMESTAMPTZ NOT NULL,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_key ON public.auth_rate_limits(key);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_expires ON public.auth_rate_limits(window_expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_locked ON public.auth_rate_limits(locked_until);

-- 2. Security Audit Logs Table (Append-Only)
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, 
    -- 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'TEMPORARY_LOCKOUT', 'RATE_LIMIT_EXCEEDED', 
    -- 'OTP_GENERATED', 'OTP_VERIFIED', 'OTP_ABUSE', 'PASSWORD_RESET_REQUESTED', 
    -- 'PASSWORD_RESET_COMPLETED', 'SUSPICIOUS_ACTIVITY', 'ACCOUNT_DISABLED_ATTEMPT', 'LOGOUT'
    masked_identifier TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILURE', 'BLOCKED', 'FLAGGED')),
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger', 'critical')),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_school ON public.security_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_status ON public.security_logs(status);

-- 3. Concurrency-Safe Rate Limit Checker & Incrementer
CREATE OR REPLACE FUNCTION public.fn_check_and_increment_rate_limit(
    p_key TEXT,
    p_action TEXT,
    p_identifier TEXT,
    p_ip TEXT,
    p_max_attempts INT,
    p_window_seconds INT,
    p_lockout_seconds INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
    v_record public.auth_rate_limits%ROWTYPE;
    v_is_locked BOOLEAN := false;
    v_lockout_rem INT := 0;
    v_reset_rem INT := 0;
    v_allowed BOOLEAN := true;
    v_require_captcha BOOLEAN := false;
BEGIN
    -- Lock row for concurrency safety if exists
    SELECT * INTO v_record
    FROM public.auth_rate_limits
    WHERE key = p_key
    FOR UPDATE;

    IF FOUND THEN
        -- Check if currently locked out
        IF v_record.locked_until IS NOT NULL AND v_record.locked_until > v_now THEN
            v_is_locked := true;
            v_allowed := false;
            v_lockout_rem := GREATEST(0, EXTRACT(EPOCH FROM (v_record.locked_until - v_now))::INT);
            RETURN jsonb_build_object(
                'allowed', false,
                'attempts', v_record.attempts,
                'remaining', 0,
                'isLockedOut', true,
                'lockoutRemainingSeconds', v_lockout_rem,
                'resetInSeconds', v_lockout_rem,
                'requireCaptcha', true,
                'reason', 'Account or IP temporarily locked due to repeated failed attempts'
            );
        END IF;

        -- Check if current window has expired
        IF v_record.window_expires_at <= v_now THEN
            -- Reset new window
            UPDATE public.auth_rate_limits
            SET attempts = 1,
                window_start = v_now,
                window_expires_at = v_now + (p_window_seconds || ' seconds')::INTERVAL,
                locked_until = NULL,
                updated_at = v_now
            WHERE key = p_key
            RETURNING * INTO v_record;

            v_reset_rem := p_window_seconds;
            RETURN jsonb_build_object(
                'allowed', true,
                'attempts', 1,
                'remaining', p_max_attempts - 1,
                'isLockedOut', false,
                'lockoutRemainingSeconds', 0,
                'resetInSeconds', v_reset_rem,
                'requireCaptcha', false
            );
        ELSE
            -- Within active window: increment attempts
            UPDATE public.auth_rate_limits
            SET attempts = v_record.attempts + 1,
                updated_at = v_now
            WHERE key = p_key
            RETURNING * INTO v_record;

            v_reset_rem := GREATEST(0, EXTRACT(EPOCH FROM (v_record.window_expires_at - v_now))::INT);

            -- Determine if lock threshold reached
            IF v_record.attempts >= p_max_attempts THEN
                v_is_locked := true;
                v_allowed := false;
                v_lockout_rem := p_lockout_seconds;

                UPDATE public.auth_rate_limits
                SET locked_until = v_now + (p_lockout_seconds || ' seconds')::INTERVAL
                WHERE key = p_key;

                RETURN jsonb_build_object(
                    'allowed', false,
                    'attempts', v_record.attempts,
                    'remaining', 0,
                    'isLockedOut', true,
                    'lockoutRemainingSeconds', v_lockout_rem,
                    'resetInSeconds', v_lockout_rem,
                    'requireCaptcha', true,
                    'reason', 'Limit exceeded. Temporary lockout applied.'
                );
            END IF;

            -- If attempts >= 3, flag captcha challenge requirement
            IF v_record.attempts >= 3 THEN
                v_require_captcha := true;
            END IF;

            RETURN jsonb_build_object(
                'allowed', true,
                'attempts', v_record.attempts,
                'remaining', GREATEST(0, p_max_attempts - v_record.attempts),
                'isLockedOut', false,
                'lockoutRemainingSeconds', 0,
                'resetInSeconds', v_reset_rem,
                'requireCaptcha', v_require_captcha
            );
        END IF;
    ELSE
        -- First attempt for this key: create new entry
        INSERT INTO public.auth_rate_limits (
            key, action, identifier, ip_address, attempts, window_start, window_expires_at, locked_until
        ) VALUES (
            p_key,
            p_action,
            p_identifier,
            p_ip,
            1,
            v_now,
            v_now + (p_window_seconds || ' seconds')::INTERVAL,
            NULL
        );

        RETURN jsonb_build_object(
            'allowed', true,
            'attempts', 1,
            'remaining', p_max_attempts - 1,
            'isLockedOut', false,
            'lockoutRemainingSeconds', 0,
            'resetInSeconds', p_window_seconds,
            'requireCaptcha', false
        );
    END IF;
END;
$$;

-- 4. Reset Rate Limit On Successful Authentication
CREATE OR REPLACE FUNCTION public.fn_reset_rate_limit(p_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM public.auth_rate_limits WHERE key = p_key;
END;
$$;

-- 5. Row-Level Security for Security Logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Owner has exclusive read access to security logs
CREATE POLICY security_logs_owner_read ON public.security_logs FOR SELECT TO authenticated
USING (public.current_user_school_role(school_id) = 'owner');

-- System service can insert logs
CREATE POLICY security_logs_system_insert ON public.security_logs FOR INSERT TO authenticated
WITH CHECK (true);
