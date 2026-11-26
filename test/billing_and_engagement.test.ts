import { describe, it, expect } from 'vitest';
import { db } from '../lib/db/database';

describe('Chambers Invoicing & Retainer Trust Ledger', () => {
  it('retrieves invoices for a client account', () => {
    const invoices = db.getInvoices('client-usr-101');
    expect(invoices.length).toBeGreaterThanOrEqual(2);
    expect(invoices[0].client_name).toBe('Jonathan Reyes');
  });

  it('settles an invoice and updates audit trail', () => {
    const pendingInv = db.getInvoices('client-usr-101').find((i) => i.status === 'pending');
    expect(pendingInv).toBeDefined();

    if (pendingInv) {
      const settled = db.payInvoice(pendingInv.id, 'Chambers Trust Account Draw');
      expect(settled).toBeDefined();
      expect(settled?.status).toBe('paid');
      expect(settled?.payment_method).toBe('Chambers Trust Account Draw');
      expect(settled?.paid_at).toBeDefined();

      // Check audit log
      const audit = db.getAuditLogs().find((a) => a.action === 'INVOICE_PAID' && a.entity_id === pendingInv.id);
      expect(audit).toBeDefined();
      expect(audit?.entity).toBe('invoices');
    }
  });
});

describe('Bilateral Engagement Mandates & E-Signature Protocol', () => {
  it('retrieves engagement letters for a client entity', () => {
    const letters = db.getEngagementLetters('client-usr-101');
    expect(letters.length).toBeGreaterThanOrEqual(1);
    expect(letters[0].client_entity).toBe('Meridian Capital Partners');
  });

  it('digitally signs engagement mandate and generates cryptographic audit record', () => {
    const letters = db.getEngagementLetters('client-usr-101');
    const letter = letters[0];
    expect(letter).toBeDefined();

    const executed = db.signEngagementLetter(letter.id, 'Jonathan Reyes');
    expect(executed).toBeDefined();
    expect(executed?.status).toBe('executed');
    expect(executed?.client_signature).toBe('Jonathan Reyes');
    expect(executed?.signed_at).toBeDefined();

    // Check audit log
    const audit = db.getAuditLogs().find(
      (a) => a.action === 'ENGAGEMENT_LETTER_EXECUTED' && a.entity_id === letter.id
    );
    expect(audit).toBeDefined();
    expect(audit?.action).toBe('ENGAGEMENT_LETTER_EXECUTED');
    expect(audit?.details).toContain('Digitally executed by Jonathan Reyes');
  });
});
