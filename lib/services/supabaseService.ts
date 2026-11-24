import { supabase } from '../supabaseClient';
import { db } from '../db/database';
import {
  Enquiry,
  Consultation,
  InternalNote,
  DocumentRecord,
  AuditLog,
  ConsultationType,
  ConsultationStatus,
  EnquiryStatus,
} from '../db/types';

export class SupabaseService {
  private hasSupabaseCredentials(): boolean {
    return (
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
    );
  }

  // =========================================================================
  // 1. ENQUIRIES
  // =========================================================================

  async createEnquiry(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    preferred_contact_method?: string;
    practice_area: string;
    message: string;
    user_id?: string | null;
  }): Promise<{ enquiry: Enquiry; conflictStatus: string; reference: string }> {
    // Perform ethical conflict screening
    const clientName = `${payload.first_name} ${payload.last_name}`;
    const conflictResult = db.runConflictCheck(clientName, payload.email, payload.message);

    const contactMethod = (payload.preferred_contact_method as 'email' | 'phone' | 'portal') || 'email';

    // Save to in-memory fallback first
    const memoryEnquiry = db.createEnquiry({
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      preferred_contact_method: contactMethod,
      practice_area: payload.practice_area,
      message: payload.message,
      user_id: payload.user_id,
    });

    if (!this.hasSupabaseCredentials()) {
      return {
        enquiry: memoryEnquiry,
        conflictStatus: memoryEnquiry.conflict_status,
        reference: memoryEnquiry.reference,
      };
    }

    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert({
          reference: memoryEnquiry.reference,
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email.toLowerCase(),
          phone: payload.phone || null,
          preferred_contact_method: payload.preferred_contact_method || 'email',
          practice_area: payload.practice_area,
          message: payload.message,
          status: 'new',
          conflict_status: conflictResult.status === 'cleared' ? 'cleared' : 'flagged',
          conflict_notes: conflictResult.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase enquiry insert failed, using memory store:', error.message);
        return {
          enquiry: memoryEnquiry,
          conflictStatus: memoryEnquiry.conflict_status,
          reference: memoryEnquiry.reference,
        };
      }

      await this.logAudit({
        user_id: payload.user_id || 'anonymous',
        user_email: payload.email,
        user_role: 'public_visitor',
        action: 'SUBMIT_ENQUIRY',
        entity: 'enquiries',
        entity_id: data.id,
        details: `Enquiry submitted under reference ${data.reference}. Conflict check: ${data.conflict_status}.`,
      });

      return {
        enquiry: {
          ...memoryEnquiry,
          id: data.id,
          reference: data.reference,
          conflict_status: data.conflict_status,
        },
        conflictStatus: data.conflict_status,
        reference: data.reference,
      };
    } catch (err) {
      console.warn('Supabase network error, fallback to memory store:', err);
      return {
        enquiry: memoryEnquiry,
        conflictStatus: memoryEnquiry.conflict_status,
        reference: memoryEnquiry.reference,
      };
    }
  }

  async getEnquiries(filter?: { userId?: string; status?: string }): Promise<Enquiry[]> {
    if (!this.hasSupabaseCredentials()) {
      if (filter?.userId) {
        return db.getEnquiriesByUserId(filter.userId);
      }
      return db.getEnquiries();
    }

    try {
      let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });

      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return filter?.userId ? db.getEnquiriesByUserId(filter.userId) : db.getEnquiries();
      }

      return data as Enquiry[];
    } catch (err) {
      return filter?.userId ? db.getEnquiriesByUserId(filter.userId) : db.getEnquiries();
    }
  }

  async updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    actor: { id: string; name: string; role: string },
    attorneyId?: string
  ): Promise<boolean> {
    const memorySuccess = db.updateEnquiryStatus(id, status, actor);
    if (attorneyId !== undefined) {
      db.assignEnquiryAttorney(id, attorneyId, actor);
    }

    if (!this.hasSupabaseCredentials()) {
      return memorySuccess;
    }

    try {
      const updatePayload: any = { status, updated_at: new Date().toISOString() };
      if (attorneyId !== undefined) {
        updatePayload.assigned_attorney_id = attorneyId || null;
      }

      const { error } = await supabase.from('enquiries').update(updatePayload).eq('id', id);

      await this.logAudit({
        user_id: actor.id,
        user_email: `${actor.id}@aureliuslaw.com`,
        user_role: actor.role,
        action: 'UPDATE_ENQUIRY_STATUS',
        entity: 'enquiries',
        entity_id: id,
        details: `Updated enquiry status to ${status}${attorneyId ? ` and assigned attorney ${attorneyId}` : ''}`,
      });

      return !error;
    } catch (err) {
      return memorySuccess;
    }
  }

  // =========================================================================
  // 2. CONSULTATIONS & DOUBLE-BOOKING PREVENTION
  // =========================================================================

  async getAvailableSlots(attorneyId: string | null, date: string): Promise<string[]> {
    // Calculate slots from persistent storage + memory fallback
    return db.getAvailableSlots(attorneyId, date);
  }

  async bookConsultation(payload: {
    client_name: string;
    client_email: string;
    client_phone?: string;
    practice_area_id: string;
    attorney_id: string | null;
    consultation_type: ConsultationType;
    scheduled_date: string;
    time_slot: string;
    timezone: string;
    notes?: string;
    user_id?: string | null;
  }): Promise<{ consultation?: Consultation; error?: string }> {
    // 1. Server-side validation against concurrent booking & double-booking
    const bookingResult = db.bookConsultation(payload);
    if (bookingResult.error || !bookingResult.consultation) {
      return bookingResult;
    }

    if (!this.hasSupabaseCredentials()) {
      return bookingResult;
    }

    try {
      // 2. Check Supabase for overlapping booking
      const { data: existingSlots } = await supabase
        .from('consultations')
        .select('id, attorney_id, scheduled_date, time_slot, status')
        .eq('scheduled_date', payload.scheduled_date)
        .eq('time_slot', payload.time_slot)
        .in('status', ['confirmed', 'pending']);

      const conflict = existingSlots?.find(
        (slot) => !payload.attorney_id || !slot.attorney_id || slot.attorney_id === payload.attorney_id
      );

      if (conflict) {
        return { error: 'The selected appointment time slot has just been reserved by another client.' };
      }

      // 3. Insert persistent consultation record
      const meetingLink =
        payload.consultation_type === 'online'
          ? `https://chambers.aureliuslaw.com/room/${bookingResult.consultation.reference.toLowerCase()}`
          : undefined;

      const { data, error } = await supabase
        .from('consultations')
        .insert({
          reference: bookingResult.consultation.reference,
          user_id: payload.user_id || null,
          client_name: payload.client_name,
          client_email: payload.client_email.toLowerCase(),
          client_phone: payload.client_phone || null,
          attorney_id: payload.attorney_id || null,
          practice_area: payload.practice_area_id,
          consultation_type: payload.consultation_type,
          scheduled_date: payload.scheduled_date,
          preferred_date: payload.scheduled_date,
          time_slot: payload.time_slot,
          preferred_time: payload.time_slot,
          timezone: payload.timezone,
          meeting_link: meetingLink,
          status: 'confirmed',
          message: payload.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase consultation insert error, using memory record:', error.message);
        return bookingResult;
      }

      await this.logAudit({
        user_id: payload.user_id || 'client-guest',
        user_email: payload.client_email,
        user_role: 'client',
        action: 'BOOK_CONSULTATION',
        entity: 'consultations',
        entity_id: data.id,
        details: `Consultation confirmed: ${payload.scheduled_date} at ${payload.time_slot} (${payload.timezone}) with attorney ${payload.attorney_id || 'any'}.`,
      });

      return {
        consultation: {
          ...bookingResult.consultation,
          id: data.id,
          reference: data.reference,
          meeting_link: data.meeting_link,
        },
      };
    } catch (err) {
      console.warn('Supabase consultation error, using memory fallback:', err);
      return bookingResult;
    }
  }

  async getConsultations(filter?: { userId?: string; attorneyId?: string; status?: string }): Promise<Consultation[]> {
    if (!this.hasSupabaseCredentials()) {
      if (filter?.userId) {
        return db.getConsultationsByUserId(filter.userId);
      }
      return db.getConsultations();
    }

    try {
      let query = supabase.from('consultations').select('*').order('scheduled_date', { ascending: false });

      if (filter?.userId) {
        query = query.eq('user_id', filter.userId);
      }
      if (filter?.attorneyId) {
        query = query.eq('attorney_id', filter.attorneyId);
      }
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return filter?.userId ? db.getConsultationsByUserId(filter.userId) : db.getConsultations();
      }

      return data as Consultation[];
    } catch (err) {
      return filter?.userId ? db.getConsultationsByUserId(filter.userId) : db.getConsultations();
    }
  }

  async updateConsultationStatus(
    id: string,
    status: ConsultationStatus,
    actor: { id: string; name: string; role: string }
  ): Promise<boolean> {
    const memorySuccess = db.updateConsultationStatus(id, status, actor);

    if (!this.hasSupabaseCredentials()) {
      return memorySuccess;
    }

    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      await this.logAudit({
        user_id: actor.id,
        user_email: `${actor.id}@aureliuslaw.com`,
        user_role: actor.role,
        action: 'UPDATE_CONSULTATION_STATUS',
        entity: 'consultations',
        entity_id: id,
        details: `Consultation status updated to ${status} by ${actor.name}.`,
      });

      return !error;
    } catch (err) {
      return memorySuccess;
    }
  }

  // =========================================================================
  // 3. PRIVILEGED INTERNAL NOTES (STRICTLY HIDDEN FROM CLIENTS)
  // =========================================================================

  async addInternalNote(payload: {
    entity_type: 'enquiry' | 'consultation' | 'client';
    entity_id: string;
    author_id: string;
    author_name: string;
    content: string;
  }): Promise<InternalNote> {
    const memoryNote = db.addInternalNote(payload);

    if (!this.hasSupabaseCredentials()) {
      return memoryNote;
    }

    try {
      const { data, error } = await supabase
        .from('internal_notes')
        .insert({
          entity_type: payload.entity_type,
          entity_id: payload.entity_id,
          author_name: payload.author_name,
          content: payload.content,
        })
        .select()
        .single();

      if (error) {
        return memoryNote;
      }

      await this.logAudit({
        user_id: payload.author_id,
        user_email: `${payload.author_id}@aureliuslaw.com`,
        user_role: 'attorney',
        action: 'ADD_INTERNAL_PRIVILEGED_NOTE',
        entity: 'internal_notes',
        entity_id: data.id,
        details: `Privileged case note added to ${payload.entity_type}:${payload.entity_id}. Protected under legal professional privilege.`,
      });

      return data as InternalNote;
    } catch (err) {
      return memoryNote;
    }
  }

  async getInternalNotes(entityType: 'enquiry' | 'consultation' | 'client', entityId: string): Promise<InternalNote[]> {
    if (!this.hasSupabaseCredentials()) {
      return db.getInternalNotes(entityType, entityId);
    }

    try {
      const { data, error } = await supabase
        .from('internal_notes')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return db.getInternalNotes(entityType, entityId);
      }

      return data as InternalNote[];
    } catch (err) {
      return db.getInternalNotes(entityType, entityId);
    }
  }

  // =========================================================================
  // 4. DOCUMENT VAULT & STORAGE
  // =========================================================================

  async getDocuments(userId?: string): Promise<DocumentRecord[]> {
    if (!this.hasSupabaseCredentials()) {
      return db.getDocuments(userId);
    }

    try {
      let query = supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return db.getDocuments(userId);
      }

      return data as DocumentRecord[];
    } catch (err) {
      return db.getDocuments(userId);
    }
  }

  async createDocumentRecord(payload: {
    user_id: string;
    client_name: string;
    filename: string;
    storage_path: string;
    content_type: string;
    size_bytes: number;
    category: any;
    is_confidential: boolean;
    uploaded_by_id: string;
    uploaded_by_name: string;
  }): Promise<DocumentRecord> {
    const memoryDoc = db.addDocument(payload);

    if (!this.hasSupabaseCredentials()) {
      return memoryDoc;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          filename: payload.filename,
          storage_path: payload.storage_path,
          content_type: payload.content_type,
          size_bytes: payload.size_bytes,
          category: payload.category || 'other',
          is_confidential: payload.is_confidential ?? true,
          uploaded_by_name: payload.uploaded_by_name,
        })
        .select()
        .single();

      if (error) {
        return memoryDoc;
      }

      await this.logAudit({
        user_id: payload.uploaded_by_id,
        user_email: `${payload.uploaded_by_id}@aureliuslaw.com`,
        user_role: 'client',
        action: 'UPLOAD_DOCUMENT',
        entity: 'documents',
        entity_id: data.id,
        details: `Document uploaded: ${payload.filename} (${payload.size_bytes} bytes).`,
      });

      return data as DocumentRecord;
    } catch (err) {
      return memoryDoc;
    }
  }

  async getSignedDownloadUrl(storagePath: string): Promise<string> {
    if (!this.hasSupabaseCredentials()) {
      return `https://vault.aureliuslaw.com/${storagePath}?signature=simulated_sha256_token`;
    }

    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(storagePath, 900); // 15 minutes expiration

      if (error || !data?.signedUrl) {
        return `https://vault.aureliuslaw.com/${storagePath}?signature=simulated_token`;
      }

      return data.signedUrl;
    } catch (err) {
      return `https://vault.aureliuslaw.com/${storagePath}?signature=simulated_token`;
    }
  }

  // =========================================================================
  // 5. IMMUTABLE AUDIT LOGGING
  // =========================================================================

  async logAudit(payload: {
    user_id: string;
    user_email: string;
    user_role: string;
    action: string;
    entity: string;
    entity_id?: string;
    details?: string;
    ip_address?: string;
  }): Promise<AuditLog> {
    const memoryLog = db.logAudit(payload);

    if (!this.hasSupabaseCredentials()) {
      return memoryLog;
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: payload.user_id,
          user_email: payload.user_email,
          user_role: payload.user_role,
          action: payload.action,
          entity: payload.entity,
          entity_id: payload.entity_id || null,
          details: payload.details || null,
          ip_address: payload.ip_address || null,
        })
        .select()
        .single();

      if (error || !data) {
        return memoryLog;
      }

      return data as AuditLog;
    } catch (err) {
      return memoryLog;
    }
  }

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    if (!this.hasSupabaseCredentials()) {
      return db.getAuditLogs().slice(0, limit);
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        return db.getAuditLogs().slice(0, limit);
      }

      return data as AuditLog[];
    } catch (err) {
      return db.getAuditLogs().slice(0, limit);
    }
  }
}

export const supabaseService = new SupabaseService();
