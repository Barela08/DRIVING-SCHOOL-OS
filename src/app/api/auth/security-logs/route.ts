import { NextRequest, NextResponse } from 'next/server';
import { securityLogService, rateLimiterStore } from '@/lib/rateLimiter';

export async function GET(req: NextRequest) {
  try {
    // Verify owner role from session cookie
    const role = req.cookies.get('ds_role')?.value;
    if (role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Only Owner accounts can view security audit logs.' },
        { status: 403 }
      );
    }

    const logs = securityLogService.getLogs();
    const stats = securityLogService.getStats();
    const lockouts = rateLimiterStore.getActiveLockouts();

    return NextResponse.json({
      success: true,
      logs,
      stats,
      lockouts
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to retrieve security logs.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.cookies.get('ds_role')?.value;
    if (role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, key, identifier } = body;

    if (action === 'clear_all_lockouts') {
      rateLimiterStore.clearAllLockouts();
      return NextResponse.json({ success: true, message: 'All temporary account and IP lockouts cleared.' });
    }

    if (action === 'clear_lockout' && (key || identifier)) {
      const targetKey = key || `login:account:${String(identifier).toLowerCase()}`;
      rateLimiterStore.reset('login:account', targetKey.replace(/^login:account:/, ''));
      return NextResponse.json({ success: true, message: `Lockout cleared for ${targetKey}` });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Action failed.' },
      { status: 500 }
    );
  }
}
