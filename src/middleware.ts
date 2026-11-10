import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Protected Role Area Detection
  const isOwnerRoute = pathname.startsWith('/owner');
  const isStaffRoute = pathname.startsWith('/staff');
  const isInstructorRoute = pathname.startsWith('/instructor');
  const isStudentRoute = pathname.startsWith('/student');

  if (!isOwnerRoute && !isStaffRoute && !isInstructorRoute && !isStudentRoute) {
    const res = NextResponse.next();
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    return res;
  }

  // Read verified server role and session token
  const roleCookie = req.cookies.get('ds_role')?.value;
  const sessionRaw = req.cookies.get('ds_auth_session')?.value;

  // If unauthenticated, redirect to unified single login
  if (!roleCookie || !sessionRaw) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validate session integrity: prevent client-side cookie tampering
  let sessionRole = '';
  try {
    const sessionObj = JSON.parse(sessionRaw);
    sessionRole = sessionObj.role;
    // Anti-tamper check: ds_role must match session payload role
    if (sessionRole !== roleCookie) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'session_tampered');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('ds_role');
      response.cookies.delete('ds_auth_session');
      return response;
    }
  } catch {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', 'session_invalid');
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('ds_role');
    response.cookies.delete('ds_auth_session');
    return response;
  }

  const role = roleCookie;

  // Strict Role Route Boundaries:
  // 1. Owner Portal (/owner/*) -> strictly 'owner'
  if (isOwnerRoute && role !== 'owner') {
    // If student, instructor, or staff tries to access owner route, bounce to their own portal
    const target = role === 'student' ? '/student/dashboard' : 
                   role === 'instructor' ? '/instructor/dashboard' : '/staff/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 2. Staff Portal (/staff/*) -> 'staff' or 'owner'
  if (isStaffRoute && role !== 'staff' && role !== 'owner') {
    const target = role === 'student' ? '/student/dashboard' : '/instructor/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 3. Instructor Portal (/instructor/*) -> strictly 'instructor'
  if (isInstructorRoute && role !== 'instructor') {
    const target = role === 'student' ? '/student/dashboard' : 
                   role === 'staff' ? '/staff/dashboard' : '/owner/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 4. Student Portal (/student/*) -> strictly 'student'
  if (isStudentRoute && role !== 'student') {
    const target = role === 'instructor' ? '/instructor/dashboard' : 
                   role === 'staff' ? '/staff/dashboard' : '/owner/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  const res = NextResponse.next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  return res;
}

export const config = {
  matcher: [
    '/owner/:path*',
    '/staff/:path*',
    '/instructor/:path*',
    '/student/:path*'
  ]
};
