import { describe, it, expect } from 'vitest';
import { db } from '../lib/db/database';

describe('Aurelius & Co. — Comprehensive Workflows & Security Verification', () => {
  describe('Phase 12-A: Public Content & Integrity', () => {
    it('should have all 15 required practice areas defined with complete metadata', () => {
      const practices = db.getAllPracticeAreas();
      expect(practices.length).toBe(15);

      practices.forEach((p) => {
        expect(p.slug).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.short_description).toBeTruthy();
        expect(p.full_description).toBeTruthy();
        expect(p.key_services.length).toBeGreaterThanOrEqual(3);
        expect(p.typical_matters.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should resolve practice areas by slug cleanly without error', () => {
      const corp = db.getPracticeAreaBySlug('corporate-commercial');
      expect(corp).toBeDefined();
      expect(corp?.title).toBe('Corporate & Commercial Law');

      const ip = db.getPracticeAreaBySlug('intellectual-property');
      expect(ip).toBeDefined();
      expect(ip?.title).toBe('Intellectual Property Rights');

      const nonExistent = db.getPracticeAreaBySlug('unregistered-specialty');
      expect(nonExistent).toBeUndefined();
    });

    it('should resolve attorneys by slug and maintain credentials integrity', () => {
      const attorneys = db.getAllAttorneys();
      expect(attorneys.length).toBeGreaterThanOrEqual(6);

      const arthur = db.getAttorneyBySlug('arthur-sterling');
      expect(arthur).toBeDefined();
      expect(arthur?.bar_admissions.length).toBeGreaterThanOrEqual(2);
      expect(arthur?.education.length).toBeGreaterThanOrEqual(1);

      const elena = db.getAttorneyBySlug('elena-rostova-hart');
      expect(elena).toBeDefined();
      expect(elena?.designation).toContain('Litigation');
    });

    it('should provide verified case studies and legal blog articles', () => {
      const studies = db.getCaseStudies();
      expect(studies.length).toBeGreaterThanOrEqual(3);
      studies.forEach((s) => {
        expect(s.client_anonymized_title).toBeTruthy();
        expect(s.challenge).toBeTruthy();
        expect(s.strategy).toBeTruthy();
        expect(s.outcome).toBeTruthy();
      });

      const posts = db.getBlogPosts();
      expect(posts.length).toBeGreaterThanOrEqual(3);
      posts.forEach((p) => {
        expect(p.title).toBeTruthy();
        expect(p.content).toBeTruthy();
        expect(p.read_time).toBeTruthy();
      });
    });
  });

  describe('Phase 12-B: Enquiry Lifecycle & Conflict Screening', () => {
    it('should accurately detect and flag adverse party references', () => {
      const benign = db.runConflictCheck('Acme Group', 'admin@acme.com', 'Drafting an international supply chain agreement.');
      expect(benign.status).toBe('cleared');

      const adverse = db.runConflictCheck('Apex Corp', 'claims@apex.com', 'Commencing hostile litigation against Meridian Capital subsidiary dispute.');
      expect(adverse.status).toBe('flagged');
    });

    it('should create an enquiry and enforce reference schema format', () => {
      const enq = db.createEnquiry({
        first_name: 'David',
        last_name: 'Pemberton',
        email: 'd.pemberton@pembertonholdings.com',
        phone: '+44 20 7000 0001',
        practice_area: 'Corporate and Commercial Law',
        message: 'Structuring an executive management buyout facility.',
      });

      expect(enq.id).toBeTruthy();
      expect(enq.reference).toMatch(/^AUR-\d{8}-[A-Z0-9]{6}$/);
      expect(enq.status).toBe('new');
    });

    it('should support full status progression through the conflict screening workflow', () => {
      const enq = db.createEnquiry({
        first_name: 'Helena',
        last_name: 'Vance',
        email: 'h.vance@vancetech.io',
        practice_area: 'Startup Legal Advisory',
        message: 'Closing Series Seed venture round with international syndicates.',
      });

      const actor = { id: 'admin-1', name: 'Managing Clerk', role: 'admin' };

      // Transition 1: under_review
      expect(db.updateEnquiryStatus(enq.id, 'under_review', actor)).toBe(true);
      expect(db.getEnquiryById(enq.id)?.status).toBe('under_review');

      // Transition 2: conflict_check
      expect(db.updateEnquiryStatus(enq.id, 'conflict_check', actor)).toBe(true);
      expect(db.getEnquiryById(enq.id)?.status).toBe('conflict_check');

      // Transition 3: consultation_scheduled
      expect(db.updateEnquiryStatus(enq.id, 'consultation_scheduled', actor)).toBe(true);
      expect(db.getEnquiryById(enq.id)?.status).toBe('consultation_scheduled');

      // Transition 4: converted
      expect(db.updateEnquiryStatus(enq.id, 'converted', actor)).toBe(true);
      expect(db.getEnquiryById(enq.id)?.status).toBe('converted');
    });

    it('should assign a lead attorney and reflect in the matter file', () => {
      const enq = db.createEnquiry({
        first_name: 'Marcus',
        last_name: 'Sterling-Test',
        email: 'm.sterling@test.com',
        practice_area: 'Civil Litigation',
        message: 'Breach of joint venture non-disclosure covenants.',
      });

      const actor = { id: 'admin-1', name: 'Managing Partner', role: 'admin' };
      expect(db.assignEnquiryAttorney(enq.id, 'att-2', actor)).toBe(true);
      expect(db.getEnquiryById(enq.id)?.assigned_attorney_id).toBe('att-2');
    });
  });

  describe('Phase 12-C: Consultation Booking & Double-Booking Prevention', () => {
    const bookingDate = '2026-12-22';
    const bookingSlot = '02:00 PM - 03:00 PM';
    const attorneyId = 'att-2';

    it('should confirm slot availability prior to booking', () => {
      expect(db.isSlotAvailable(attorneyId, bookingDate, bookingSlot)).toBe(true);
    });

    it('should book a consultation, assign unique CON- reference, and generate meeting link', () => {
      const res = db.bookConsultation({
        client_name: 'Sarah Chen, Ph.D.',
        client_email: 's.chen@atlastherapeutics.com',
        client_phone: '+1 415 555 0100',
        practice_area_id: 'pa-litigation',
        attorney_id: attorneyId,
        consultation_type: 'online',
        scheduled_date: bookingDate,
        time_slot: bookingSlot,
        timezone: 'EST (UTC-5)',
        notes: 'Pre-arbitration risk appraisal.',
      });

      expect(res.consultation).toBeDefined();
      expect(res.consultation?.reference).toMatch(/^CON-\d{8}-[A-Z0-9]{6}$/);
      expect(res.consultation?.meeting_link).toContain('https://meet.aureliuslaw.com/');
      expect(res.consultation?.status).toBe('confirmed');
    });

    it('should decisively block duplicate reservation attempts on the same slot', () => {
      const collision = db.bookConsultation({
        client_name: 'Conflicting Party',
        client_email: 'conflict@party.com',
        practice_area_id: 'pa-litigation',
        attorney_id: attorneyId,
        consultation_type: 'online',
        scheduled_date: bookingDate,
        time_slot: bookingSlot,
        timezone: 'EST (UTC-5)',
      });

      expect(collision.consultation).toBeUndefined();
      expect(collision.error).toContain('no longer available');
    });

    it('should exclude the booked slot from getAvailableSlots for that date and attorney', () => {
      const available = db.getAvailableSlots(attorneyId, bookingDate);
      expect(available).not.toContain(bookingSlot);
    });
  });

  describe('Phase 12-D: Privileged Notes & Confidentiality Segregation', () => {
    it('should segregate privileged attorney notes to their respective entity ID', () => {
      const enqA = db.createEnquiry({
        first_name: 'Matter',
        last_name: 'Alpha',
        email: 'alpha@matter.com',
        practice_area: 'Property & Real Estate Law',
        message: 'Commercial acquisition of logistics hub.',
      });

      const enqB = db.createEnquiry({
        first_name: 'Matter',
        last_name: 'Beta',
        email: 'beta@matter.com',
        practice_area: 'Taxation & Compliance',
        message: 'Cross-border transfer pricing audit.',
      });

      db.addInternalNote({
        entity_type: 'enquiry',
        entity_id: enqA.id,
        author_id: 'att-6',
        author_name: 'Alistair Moreau',
        content: 'Alpha appraisal: $82M acquisition target.',
      });

      const notesA = db.getInternalNotes('enquiry', enqA.id);
      const notesB = db.getInternalNotes('enquiry', enqB.id);

      expect(notesA.length).toBe(1);
      expect(notesA[0].content).toContain('$82M');
      expect(notesB.length).toBe(0);
    });
  });

  describe('Phase 12-E: Immutable Audit Logging', () => {
    it('should record administrative operations in chronological order', () => {
      const initialLogs = db.getAuditLogs().length;

      db.logAudit({
        user_id: 'admin-auditor',
        user_email: 'auditor@aureliuslaw.com',
        user_role: 'admin',
        action: 'COMPLIANCE_SCREENING_CLEARED',
        entity: 'enquiries',
        details: 'Verified against international sanctions lists.',
      });

      const updatedLogs = db.getAuditLogs();
      expect(updatedLogs.length).toBe(initialLogs + 1);
      expect(updatedLogs[0].action).toBe('COMPLIANCE_SCREENING_CLEARED');
      expect(updatedLogs[0].created_at).toBeTruthy();
    });
  });
});
