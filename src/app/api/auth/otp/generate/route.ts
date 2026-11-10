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
        { success: false, error: 'Mobile number or Student Code is required.' },
        { status: 400 }
      );
    }

    const rawId = String(identifier).trim();
    const cleanId = rawId.toLowerCase();

    // 1. IP Rate Limiting (10 requests in 15 mins)
    const ipCheck = await rateLimiterStore.checkAndIncrement('otp_gen:ip', clientIp, clientIp);
    if (!ipCheck.allowed) {
      securityLogService.logEvent(
        'RATE_LIMIT_EXCEEDED',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'warning',
        { endpoint: 'otp-generate', scope: 'ip' }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Too many OTP requests from this network. Please wait 15 minutes.',
          isLockedOut: true,
          lockoutRemainingSeconds: ipCheck.lockoutRemainingSeconds
        },
        { status: 429 }
      );
    }

    // 2. Account Rate Limiting (3 requests in 15 mins)
    const accountCheck = await rateLimiterStore.checkAndIncrement('otp_gen:account', cleanId, clientIp);
    if (!accountCheck.allowed) {
      securityLogService.logEvent(
        'RATE_LIMIT_EXCEEDED',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'warning',
        { endpoint: 'otp-generate', scope: 'account' }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'OTP generation limit reached (3 requests in 15 minutes). Please wait before requesting another OTP.',
          isLockedOut: true,
          lockoutRemainingSeconds: accountCheck.lockoutRemainingSeconds
        },
        { status: 429 }
      );
    }

    // 3. Log OTP Generated (simulated 6-digit OTP delivery)
    securityLogService.logEvent(
      'OTP_GENERATED',
      rawId,
      clientIp,
      userAgent,
      'SUCCESS',
      'info',
      { remainingAttempts: accountCheck.remaining }
    );

    return NextResponse.json({
      success: true,
      message: 'One-Time Password (OTP) dispatched to registered phone.',
      remainingRequests: accountCheck.remaining
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'OTP generation error.' },
      { status: 500 }
    );
  }
}
