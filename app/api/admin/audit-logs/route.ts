import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/services/supabaseService';
import { verifyUserToken, hasAllowedRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authUser = await verifyUserToken(request);
    if (authUser && !hasAllowedRole(authUser, ['admin', 'super_admin'])) {
      return NextResponse.json({ error: 'Unauthorized: Audit trail oversight is restricted to system administrators.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const auditLogs = await supabaseService.getAuditLogs(limit);
    return NextResponse.json({ auditLogs });
  } catch (error) {
    console.error('Audit logs GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve immutable audit logs.' }, { status: 500 });
  }
}
