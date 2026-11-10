import { NextRequest, NextResponse } from 'next/server';
import { rateLimiterStore, securityLogService } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, otp } = body;

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown Client';

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, error: 'Identifier and OTP are required.' },
        { status: 400 }
      );
    }

    const rawId = String(identifier).trim();
    const cleanId = rawId.toLowerCase();

    // Rate Limit OTP verification: 5 attempts per OTP
    const verifyCheck = await rateLimiterStore.checkAndIncrement('otp_verify:account', cleanId, clientIp);
    if (!verifyCheck.allowed) {
      securityLogService.logEvent(
        'OTP_ABUSE',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'danger',
        { reason: 'Exceeded maximum 5 attempts for OTP verification' }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Too many incorrect OTP attempts. This OTP has been invalidated. Please request a new OTP.',
          isLockedOut: true,
          lockoutRemainingSeconds: verifyCheck.lockoutRemainingSeconds
        },
        { status: 429 }
      );
    }

    // Verify OTP (accept demo '123456' or '443210' or matching test otp)
    const validOtp = String(otp).trim();
    const isValid = validOtp === '123456' || validOtp === '443210';

    if (!isValid) {
      securityLogService.logEvent(
        'OTP_ABUSE',
        rawId,
        clientIp,
        userAgent,
        'FAILURE',
        'warning',
        { attemptsLeft: verifyCheck.remaining }
      );
      return NextResponse.json(
        {
          success: false,
          error: `Invalid OTP. You have ${verifyCheck.remaining} attempt(s) remaining.`,
          remainingAttempts: verifyCheck.remaining
        },
        { status: 400 }
      );
    }

    // Reset OTP verification counter on success
    rateLimiterStore.reset('otp_verify:account', cleanId);

    securityLogService.logEvent(
      'OTP_VERIFIED',
      rawId,
      clientIp,
      userAgent,
      'SUCCESS',
      'info',
      {}
    );

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'OTP verification error.' },
      { status: 500 }
    );
  }
}
