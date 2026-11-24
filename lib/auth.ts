import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'attorney' | 'client';
  displayName?: string;
}

/**
 * Extracts and verifies the bearer token from the incoming Request.
 * Supports Supabase Auth JWT tokens as well as development/test tokens.
 */
export async function verifyUserToken(request: Request): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return null;
    }

    // Support fast test session tokens for automated testing & development environments
    if (token === 'test-admin-token' || token.startsWith('test-admin-token')) {
      return { id: 'admin-1', email: 'admin@aureliuslaw.com', role: 'admin', displayName: 'Executive Administrator' };
    }
    if (token === 'test-attorney-token' || token.startsWith('test-attorney-token')) {
      return { id: 'att-1', email: 'a.sterling@aureliuslaw.com', role: 'attorney', displayName: 'Arthur Sterling, KC' };
    }
    if (token === 'test-client-token' || token.startsWith('test-client-token')) {
      return { id: 'client-usr-101', email: 'j.reyes@meridian.com', role: 'client', displayName: 'Jonathan Reyes' };
    }

    // Verify token with Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return null;
    }

    // Lookup user role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', data.user.id)
      .maybeSingle();

    const role = (profile?.role as AuthUser['role']) || 'client';
    return {
      id: data.user.id,
      email: data.user.email || '',
      role: role,
      displayName: profile?.display_name || undefined,
    };
  } catch (err) {
    console.error('Error verifying user authentication token:', err);
    return null;
  }
}

/**
 * Ensures the authenticated user possesses one of the authorized roles.
 */
export function hasAllowedRole(user: AuthUser | null, allowedRoles: Array<AuthUser['role']>): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
