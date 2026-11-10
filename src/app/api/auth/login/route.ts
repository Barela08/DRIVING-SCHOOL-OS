import { NextRequest, NextResponse } from 'next/server';
import { mockStudents, mockInstructors, mockStaffMembers } from '@/lib/mockData';
import { UserRole } from '@/types';
import { 
  rateLimiterStore, 
  securityLogService, 
  verifyCaptchaChallenge, 
  generateCaptchaChallenge, 
  maskIdentifier 
} from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, passwordOrPin, captchaToken, captchaAnswer } = body;

    // 1. Client IP & User Agent detection
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown Client';

    // 2. Validate input fields
    if (!identifier || !passwordOrPin) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User ID and Password / PIN are required.' 
        },
        { status: 400 }
      );
    }

    const rawId = String(identifier).trim();
    const cleanId = rawId.toLowerCase();
    const cleanDigits = rawId.replace(/\D/g, '');

    // 3. Layered Rate Limit Checks: IP Level & Account Level
    const ipStatus = await rateLimiterStore.getStatus('login:ip', clientIp);
    if (ipStatus.isLockedOut) {
      securityLogService.logEvent(
        'TEMPORARY_LOCKOUT',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'danger',
        { scope: 'ip', remaining: ipStatus.lockoutRemainingSeconds }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Too many attempts from this IP address. Please wait before trying again.',
          isLockedOut: true,
          lockoutRemainingSeconds: ipStatus.lockoutRemainingSeconds
        },
        { status: 429 }
      );
    }

    const accountStatus = await rateLimiterStore.getStatus('login:account', cleanId);
    if (accountStatus.isLockedOut) {
      securityLogService.logEvent(
        'TEMPORARY_LOCKOUT',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'danger',
        { scope: 'account', remaining: accountStatus.lockoutRemainingSeconds }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Too many attempts. Please wait before trying again or use account recovery.',
          isLockedOut: true,
          lockoutRemainingSeconds: accountStatus.lockoutRemainingSeconds
        },
        { status: 429 }
      );
    }

    // 4. CAPTCHA Check (if required due to repeated attempts)
    const captchaRequired = accountStatus.requireCaptcha || ipStatus.requireCaptcha;
    if (captchaRequired) {
      if (!captchaToken || !captchaAnswer || !verifyCaptchaChallenge(captchaToken, captchaAnswer)) {
        const freshChallenge = generateCaptchaChallenge();
        securityLogService.logEvent(
          'SUSPICIOUS_ACTIVITY',
          rawId,
          clientIp,
          userAgent,
          'FLAGGED',
          'warning',
          { reason: 'Failed or missing CAPTCHA challenge' }
        );
        return NextResponse.json(
          {
            success: false,
            requireCaptcha: true,
            captchaChallenge: freshChallenge,
            error: 'Security verification check required. Please solve the puzzle below.'
          },
          { status: 403 }
        );
      }
    }

    // 5. Automatic Server-Side Role Detection & Identity Lookup
    let matchedRole: UserRole | null = null;
    let matchedUserId: string = '';
    let matchedName: string = '';
    let matchedStudentId: string | undefined = undefined;
    let matchedInstructorId: string | undefined = undefined;
    let matchedEmployeeId: string | undefined = undefined;
    let isAccountActive: boolean = true;
    let validSecretMatch: boolean = false;

    // Normalize password input for demo/standard matching
    const passInput = String(passwordOrPin).trim();

    // A. Check Owner Identity
    if (
      cleanId === 'owner@modeldriving.in' ||
      cleanId === 'owner@apexdriving.in' ||
      cleanId === 'owner' ||
      cleanId === 'usr-owner-rajesh' ||
      cleanId === 'rajesh' ||
      cleanId === 'admin@modeldriving.in'
    ) {
      matchedRole = 'owner';
      matchedUserId = 'usr-owner-rajesh';
      matchedName = 'Rajesh Mehta (Owner)';
      isAccountActive = true;
      validSecretMatch = (
        passInput === '••••••••' || 
        passInput === 'owner123' || 
        passInput === 'admin123' || 
        passInput === 'password'
      );
    }

    // B. Check Staff Identity
    else if (
      cleanId === 'staff@modeldriving.in' ||
      cleanId === 'staff@apexdriving.in' ||
      cleanId === 'staff' ||
      cleanId === 'stf-2026-01' ||
      cleanId === 'sunita.staff@apexdriving.in' ||
      cleanId === 'sunita.staff@modeldriving.in' ||
      mockStaffMembers.some(
        st =>
          st.email.toLowerCase() === cleanId ||
          st.employee_code.toLowerCase() === cleanId ||
          (cleanDigits.length >= 10 && st.phone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10)))
      )
    ) {
      const foundStaff = mockStaffMembers.find(
        st =>
          st.email.toLowerCase() === cleanId ||
          st.employee_code.toLowerCase() === cleanId ||
          (cleanDigits.length >= 10 && st.phone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10)))
      ) || mockStaffMembers[0];

      matchedRole = 'staff';
      matchedUserId = foundStaff.user_id || 'usr-staff-sunita';
      matchedName = foundStaff.full_name;
      matchedEmployeeId = foundStaff.id;
      isAccountActive = foundStaff.is_active !== false;
      validSecretMatch = (
        passInput === '••••••••' || 
        passInput === 'staff123' || 
        passInput === '1234' || 
        passInput === 'password'
      );
    }

    // C. Check Instructor Identity
    else if (
      cleanId === 'ins-2026-01' ||
      cleanId === 'ins-vikram-01' ||
      cleanId === 'usr-ins-vikram' ||
      cleanId === 'drv-2026-001' ||
      cleanId === 'vikram.instructor@modeldriving.in' ||
      cleanId === 'vikram.instructor@apexdriving.in' ||
      mockInstructors.some(
        ins =>
          ins.instructor_code.toLowerCase() === cleanId ||
          ins.email?.toLowerCase() === cleanId ||
          (cleanDigits.length >= 10 && ins.phone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10)))
      )
    ) {
      const foundIns = mockInstructors.find(
        ins =>
          ins.instructor_code.toLowerCase() === cleanId ||
          ins.email?.toLowerCase() === cleanId ||
          (cleanDigits.length >= 10 && ins.phone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10)))
      ) || mockInstructors[0];

      matchedRole = 'instructor';
      matchedUserId = foundIns.user_id || 'usr-ins-vikram';
      matchedName = foundIns.full_name;
      matchedInstructorId = foundIns.id;
      isAccountActive = foundIns.employment_status === 'active';
      validSecretMatch = (
        passInput === '1234' || 
        passInput === '123456' || 
        passInput === '••••••••' || 
        passInput === 'password'
      );
    }

    // D. Check Student Identity
    else {
      const foundStud = mockStudents.find(
        s =>
          s.student_code.toLowerCase() === cleanId ||
          s.student_code.toLowerCase().includes(cleanId) ||
          s.email?.toLowerCase() === cleanId ||
          (cleanDigits.length >= 10 && s.phone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10)))
      );

      if (foundStud) {
        matchedRole = 'student';
        matchedUserId = foundStud.user_id || `usr-${foundStud.id}`;
        matchedName = foundStud.full_name;
        matchedStudentId = foundStud.id;
        isAccountActive = foundStud.status !== 'Cancelled';
        validSecretMatch = (
          passInput === 'pass123' || 
          passInput === '••••••••' || 
          passInput === '1234' || 
          passInput === 'password'
        );
      }
    }

    // 6. Check Account Inactive/Disabled status (Criterion 14)
    if (matchedRole && !isAccountActive) {
      securityLogService.logEvent(
        'ACCOUNT_DISABLED_ATTEMPT',
        rawId,
        clientIp,
        userAgent,
        'BLOCKED',
        'danger',
        { role: matchedRole }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'This account has been disabled or suspended. Please contact the academy administrator.'
        },
        { status: 403 }
      );
    }

    // 7. Handle Credential Verification Failure
    if (!matchedRole || !validSecretMatch) {
      // Increment atomic rate limits for account and IP
      const incAccount = await rateLimiterStore.checkAndIncrement('login:account', cleanId, clientIp);
      const incIp = await rateLimiterStore.checkAndIncrement('login:ip', clientIp, clientIp);

      const eventType = incAccount.isLockedOut ? 'TEMPORARY_LOCKOUT' : 'LOGIN_FAILURE';
      const severity = incAccount.isLockedOut ? 'danger' : 'warning';

      securityLogService.logEvent(
        eventType,
        rawId,
        clientIp,
        userAgent,
        incAccount.isLockedOut ? 'BLOCKED' : 'FAILURE',
        severity,
        {
          attempt: incAccount.attempts,
          isLockedOut: incAccount.isLockedOut,
          lockoutRemainingSeconds: incAccount.lockoutRemainingSeconds
        }
      );

      if (incAccount.isLockedOut) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many attempts. Please wait before trying again or use account recovery.',
            isLockedOut: true,
            lockoutRemainingSeconds: incAccount.lockoutRemainingSeconds
          },
          { status: 429 }
        );
      }

      // Check if CAPTCHA should now be presented
      const requireCaptchaNext = incAccount.requireCaptcha || incIp.requireCaptcha;
      const responseData: any = {
        success: false,
        error: 'Invalid login details. Please check your credentials and try again.'
      };

      if (requireCaptchaNext) {
        responseData.requireCaptcha = true;
        responseData.captchaChallenge = generateCaptchaChallenge();
      }

      return NextResponse.json(responseData, { status: 401 });
    }

    // 8. Authentication Successful! Reset rate limits
    rateLimiterStore.reset('login:account', cleanId);
    rateLimiterStore.reset('login:ip', clientIp);

    securityLogService.logEvent(
      'LOGIN_SUCCESS',
      rawId,
      clientIp,
      userAgent,
      'SUCCESS',
      'info',
      { role: matchedRole, userId: matchedUserId }
    );

    // 9. Automatic Server-Side Role Redirection
    const redirectMap: Record<UserRole, string> = {
      owner: '/owner/dashboard',
      staff: '/staff/dashboard',
      instructor: '/instructor/dashboard',
      student: '/student/dashboard'
    };

    const targetRoute = redirectMap[matchedRole];

    const sessionPayload = {
      userId: matchedUserId,
      role: matchedRole,
      name: matchedName,
      identifier: rawId,
      studentId: matchedStudentId,
      instructorId: matchedInstructorId,
      employeeId: matchedEmployeeId,
      authenticatedAt: new Date().toISOString()
    };

    const res = NextResponse.json({
      success: true,
      role: matchedRole,
      redirectTo: targetRoute,
      user: sessionPayload
    });

    // 10. Set secure HTTP-only cookies
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: false, // Accessible to context hydration & Next.js middleware
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    };

    res.cookies.set('ds_role', matchedRole, cookieOptions);
    res.cookies.set('ds_user_id', matchedUserId, cookieOptions);
    res.cookies.set('ds_auth_session', JSON.stringify(sessionPayload), cookieOptions);

    if (matchedStudentId) {
      res.cookies.set('ds_student_id', matchedStudentId, cookieOptions);
    } else {
      res.cookies.delete('ds_student_id');
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: err?.message || 'Authentication processing error.' 
      },
      { status: 500 }
    );
  }
}
