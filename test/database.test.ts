import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../lib/db/database';

describe('Aurelius & Co. — Core Legal Business Logic & Engines', () => {
  it('should generate valid practice areas and attorneys', () => {
    const practiceAreas = db.getPracticeAreas();
    expect(practiceAreas.length).toBeGreaterThanOrEqual(15);

    const attorneys = db.getAttorneys();
    expect(attorneys.length).toBeGreaterThanOrEqual(6);
    expect(attorneys[0].full_name).toContain('Arthur Sterling');
  });

  describe('Conflict of Interest Screening Engine', () => {
    it('should clear benign enquiry submissions', () => {
      const result = db.runConflictCheck('Acme Corp Ltd', 'contact@acmecorp.com', 'Seeking general corporate advisory for overseas expansion.');
      expect(result.status).toBe('cleared');
      expect(result.notes).toContain('No adverse representation');
    });

    it('should flag adverse parties and hostile disputes for manual compliance clearance', () => {
      const result = db.runConflictCheck('Apex Capital', 'claims@apex.com', 'We are filing a hostile takeover injunction against Meridian Capital subsidiary dispute.');
      expect(result.status).toBe('flagged');
      expect(result.notes).toContain('Potential conflict flagged');
    });
  });

  describe('Consultation Scheduling & Double-Booking Prevention', () => {
    const testDate = '2026-12-15';
    const testSlot = '10:00 AM - 11:00 AM';
    const testAttorneyId = 'att-1';

    it('should check slot availability accurately', () => {
      const isAvailableInitial = db.isSlotAvailable(testAttorneyId, testDate, testSlot);
      expect(isAvailableInitial).toBe(true);
    });

    it('should successfully book a consultation and generate unique reference', () => {
      const booking = db.bookConsultation({
        client_name: 'Genevieve Dupond',
        client_email: 'g.dupond@luxuryprivate.fr',
        client_phone: '+33 1 42 68 00 00',
        practice_area_id: 'pa-corp',
        attorney_id: testAttorneyId,
        consultation_type: 'online',
        scheduled_date: testDate,
        time_slot: testSlot,
        timezone: 'CET (UTC+1)',
        notes: 'Discussion regarding European distribution restructuring.',
      });

      expect(booking.consultation).toBeDefined();
      expect(booking.consultation?.reference).toMatch(/^CON-\d{8}-[A-Z0-9]{6}$/);
      expect(booking.consultation?.status).toBe('confirmed');
    });

    it('should prevent double booking the exact same attorney and time slot', () => {
      const duplicateBooking = db.bookConsultation({
        client_name: 'Charles Bennett',
        client_email: 'c.bennett@bennettindustries.com',
        practice_area_id: 'pa-corp',
        attorney_id: testAttorneyId,
        consultation_type: 'online',
        scheduled_date: testDate,
        time_slot: testSlot,
        timezone: 'GMT (UTC+0)',
      });

      expect(duplicateBooking.error).toBeDefined();
      expect(duplicateBooking.error).toContain('no longer available');
      expect(duplicateBooking.consultation).toBeUndefined();
    });

    it('should exclude booked slots from getAvailableSlots', () => {
      const available = db.getAvailableSlots(testAttorneyId, testDate);
      expect(available).not.toContain(testSlot);
      expect(available.length).toBeGreaterThan(0);
    });
  });

  describe('Enquiry Workflow & Status Transitions', () => {
    it('should create an enquiry with valid reference and initial status', () => {
      const enquiry = db.createEnquiry({
        first_name: 'Eleanor',
        last_name: 'Pemberton',
        email: 'e.pemberton@pembertonholdings.co.uk',
        practice_area: 'Corporate and Commercial Law',
        message: 'Reviewing our family office investment covenants for upcoming real estate syndicate.',
      });

      expect(enquiry.reference).toMatch(/^AUR-\d{8}-[A-Z0-9]{6}$/);
      expect(enquiry.status).toBe('new');
    });

    it('should transition enquiry status through full lifecycle with audit logging', () => {
      const enquiry = db.createEnquiry({
        first_name: 'Marcus',
        last_name: 'Aurelius-Test',
        email: 'test@aurelius-test.com',
        practice_area: 'Civil Litigation',
        message: 'Test message for status transition checks.',
      });

      const staff = { id: 'usr-admin-1', name: 'Admin Staff', role: 'admin' };

      // Transition to under_review
      const res1 = db.updateEnquiryStatus(enquiry.id, 'under_review', staff);
      expect(res1).toBe(true);
      expect(db.getEnquiryById(enquiry.id)?.status).toBe('under_review');

      // Transition to conflict_check
      const res2 = db.updateEnquiryStatus(enquiry.id, 'conflict_check', staff);
      expect(res2).toBe(true);
      expect(db.getEnquiryById(enquiry.id)?.status).toBe('conflict_check');

      // Assign attorney
      const resAssign = db.assignEnquiryAttorney(enquiry.id, 'att-2', staff);
      expect(resAssign).toBe(true);
      expect(db.getEnquiryById(enquiry.id)?.assigned_attorney_id).toBe('att-2');
    });
  });

  describe('Privileged Internal Notes & Audit Logs', () => {
    it('should add privileged internal notes and retrieve them strictly for the entity', () => {
      const enquiry = db.createEnquiry({
        first_name: 'Secret',
        last_name: 'Client',
        email: 'secret@client.com',
        practice_area: 'Property & Real Estate Law',
        message: 'Strictly confidential pre-acquisition note.',
      });

      const note = db.addInternalNote({
        entity_type: 'enquiry',
        entity_id: enquiry.id,
        author_id: 'att-6',
        author_name: 'Alistair Moreau',
        content: 'Confidential valuation benchmark indicates $45M target property.',
      });

      expect(note.id).toBeDefined();

      const retrievedNotes = db.getInternalNotes('enquiry', enquiry.id);
      expect(retrievedNotes.length).toBe(1);
      expect(retrievedNotes[0].content).toContain('Confidential valuation');
    });

    it('should record immutable audit logs for administrative events', () => {
      const logs = db.getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].created_at).toBeDefined();
    });
  });
});
