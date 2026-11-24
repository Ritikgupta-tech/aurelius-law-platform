import { describe, it, expect } from 'vitest';
import { verifyUserToken, hasAllowedRole } from '../lib/auth';
import { checkRateLimit } from '../lib/rateLimit';
import { supabaseService } from '../lib/services/supabaseService';

describe('Security, RBAC & Protection Controls', () => {
  describe('RBAC & Token Validation', () => {
    it('correctly decodes and validates administrator tokens', async () => {
      const mockReq = new Request('http://localhost:3000/api/admin/notes', {
        headers: { Authorization: 'Bearer test-admin-token' },
      });
      const user = await verifyUserToken(mockReq);
      expect(user).not.toBeNull();
      expect(user?.role).toBe('admin');
      expect(hasAllowedRole(user, ['admin', 'super_admin'])).toBe(true);
    });

    it('correctly decodes attorney tokens and grants legal privilege', async () => {
      const mockReq = new Request('http://localhost:3000/api/admin/notes', {
        headers: { Authorization: 'Bearer test-attorney-token' },
      });
      const user = await verifyUserToken(mockReq);
      expect(user).not.toBeNull();
      expect(user?.role).toBe('attorney');
      expect(hasAllowedRole(user, ['attorney', 'admin'])).toBe(true);
    });

    it('correctly restricts client roles from privileged administrative access', async () => {
      const mockReq = new Request('http://localhost:3000/api/admin/notes', {
        headers: { Authorization: 'Bearer test-client-token' },
      });
      const user = await verifyUserToken(mockReq);
      expect(user).not.toBeNull();
      expect(user?.role).toBe('client');
      // Clients must never have attorney or admin role
      expect(hasAllowedRole(user, ['admin', 'super_admin', 'attorney'])).toBe(false);
    });
  });

  describe('Sliding-Window Rate Limiter', () => {
    const testIpKey = 'test_ip_192.168.1.100';

    it('allows requests within threshold and blocks excess requests', () => {
      // Allow up to 3 requests in a 10s window
      const res1 = checkRateLimit(testIpKey, 3, 10_000);
      expect(res1.allowed).toBe(true);
      expect(res1.remaining).toBe(2);

      const res2 = checkRateLimit(testIpKey, 3, 10_000);
      expect(res2.allowed).toBe(true);
      expect(res2.remaining).toBe(1);

      const res3 = checkRateLimit(testIpKey, 3, 10_000);
      expect(res3.allowed).toBe(true);
      expect(res3.remaining).toBe(0);

      // 4th request must be rejected
      const res4 = checkRateLimit(testIpKey, 3, 10_000);
      expect(res4.allowed).toBe(false);
      expect(res4.remaining).toBe(0);
    });
  });

  describe('Immutable Audit Logging', () => {
    it('creates immutable audit logs upon actions', async () => {
      const initialLogs = await supabaseService.getAuditLogs();
      const initialCount = initialLogs.length;

      await supabaseService.logAudit({
        user_id: 'admin-1',
        user_email: 'audit-test@aureliuslaw.com',
        user_role: 'admin',
        action: 'SECURITY_AUDIT_TEST',
        entity: 'system',
        details: 'Automated security test executed.',
      });

      const updatedLogs = await supabaseService.getAuditLogs();
      expect(updatedLogs.length).toBeGreaterThan(initialCount);
      expect(updatedLogs[0].action).toBe('SECURITY_AUDIT_TEST');
    });
  });
});
