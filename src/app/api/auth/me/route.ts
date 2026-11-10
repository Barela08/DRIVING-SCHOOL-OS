import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('ds_auth_session')?.value;
  const roleCookie = req.cookies.get('ds_role')?.value;

  if (!sessionCookie || !roleCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const session = JSON.parse(sessionCookie);
    return NextResponse.json({
      authenticated: true,
      user: session,
      role: roleCookie
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
