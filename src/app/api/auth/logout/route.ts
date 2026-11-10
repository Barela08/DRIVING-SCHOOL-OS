import { NextRequest, NextResponse } from 'next/server';
import { securityLogService } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown Client';

    const sessionCookie = req.cookies.get('ds_auth_session')?.value;
    let identifier = 'authenticated_user';
    let role = 'unknown';

    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        identifier = parsed.identifier || parsed.userId || 'authenticated_user';
        role = parsed.role || 'unknown';
      } catch {
        // ignore parse error
      }
    }

    securityLogService.logEvent(
      'LOGOUT',
      identifier,
      clientIp,
      userAgent,
      'SUCCESS',
      'info',
      { role }
    );

    const res = NextResponse.json({
      success: true,
      message: 'Session revoked and logged out successfully.'
    });

    // Clear all auth cookies
    res.cookies.delete('ds_role');
    res.cookies.delete('ds_user_id');
    res.cookies.delete('ds_auth_session');
    res.cookies.delete('ds_student_id');

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Logout failed.' },
      { status: 500 }
    );
  }
}
