import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const role = req.cookies.get('ds_role')?.value;
    const sessionRaw = req.cookies.get('ds_auth_session')?.value;

    if (!role || !sessionRaw) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      const user = JSON.parse(sessionRaw);
      return NextResponse.json({
        authenticated: true,
        role,
        user
      });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
