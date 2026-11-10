import { NextRequest, NextResponse } from 'next/server';
import { rateLimiterStore, securityLogService } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body;

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown Client';

    if (!identifier || !String(identifier).trim()) {
      return NextResponse.json(
        { success: false, error: 'Identifier is required.' },
        { status: 400 }
      );
    }

    const rawId = String(identifier).trim();
    const cleanId = rawId.toLowerCase();

    // 1. IP Rate Limiting (5 requests per hour)
    const ipCheck = await rateLimiterStore.checkAndIncrement('recovery:account', clientIp, clientIp);
    if (!ipCheck.allowed) {
      securityLogService.logEvent(
        'RATE_LIMIT_EXCEEDED',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'warning',
        { endpoint: 'forgot-password', scope: 'ip' }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Too many recovery requests from this network. Please wait before trying again.',
          isLockedOut: true,
          lockoutRemainingSeconds: ipCheck.lockoutRemainingSeconds
        },
        { status: 429 }
      );
    }

    // 2. Account-Level Rate Limiting (3 requests per hour)
    const accountCheck = await rateLimiterStore.checkAndIncrement('pwd_reset:account', cleanId, clientIp);
    if (!accountCheck.allowed) {
      securityLogService.logEvent(
        'RATE_LIMIT_EXCEEDED',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'warning',
        { endpoint: 'forgot-password', scope: 'account' }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Password reset request limit reached for this account. Please wait 1 hour or contact the front desk.',
          isLockedOut: true,
          lockoutRemainingSeconds: accountCheck.lockoutRemainingSeconds
        },
        { status: 429 }
      );
    }

    // 3. Log security event (masked identifier, no credentials)
    securityLogService.logEvent(
      'PASSWORD_RESET_REQUESTED',
      rawId,
      clientIp,
      userAgent,
      'SUCCESS',
      'info',
      { remainingAttempts: accountCheck.remaining }
    );

    // 4. Return generic, safe message to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account matches those details, password recovery instructions have been dispatched.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Password reset request processing error.' },
      { status: 500 }
    );
  }
}
