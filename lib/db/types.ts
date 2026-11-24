export type UserRole = 'super_admin' | 'admin' | 'attorney' | 'staff' | 'client';

export type EnquiryStatus =
  | 'new'
  | 'under_review'
  | 'conflict_check'
  | 'awaiting_client_response'
  | 'consultation_scheduled'
  | 'converted'
  | 'closed'
  | 'rejected';

export type ConsultationStatus =
  | 'pending'
  | 'confirmed'
  | 'reschedule_requested'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type ConsultationType = 'online' | 'in_person' | 'phone';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Attorney {
  id: string;
  user_id?: string;
  full_name: string;
  slug: string;
  title: string; // e.g. Senior Partner, Managing Partner
  designation: string; // e.g. Partner, Corporate M&A
  primary_practice_id: string;
  practice_area_ids: string[];
  email: string;
  phone: string;
  office_location: string;
  bar_admissions: string[];
  education: string[];
  bio: string;
  quote?: string;
  experience_years: number;
  photo_url: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
}

export interface PracticeArea {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  icon_name: string;
  featured_image: string;
  key_services: string[];
  typical_matters: string[];
  lead_attorney_id?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Enquiry {
  id: string;
  reference: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  practice_area: string;
  preferred_contact_method: 'email' | 'phone' | 'portal';
  message: string;
  status: EnquiryStatus;
  conflict_status: 'pending' | 'cleared' | 'flagged';
  conflict_notes?: string;
  assigned_attorney_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnquiryActivityLog {
  id: string;
  enquiry_id: string;
  performed_by_id: string;
  performed_by_name: string;
  action: string;
  notes?: string;
  created_at: string;
}

export interface Consultation {
  id: string;
  reference: string;
  user_id?: string | null;
  client_name: string;
  client_email: string;
  client_phone?: string;
  practice_area_id: string;
  practice_area_title: string;
  attorney_id?: string | null;
  attorney_name?: string;
  consultation_type: ConsultationType;
  scheduled_date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "10:00 AM - 11:00 AM"
  timezone: string;
  notes?: string;
  status: ConsultationStatus;
  meeting_link?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface AttorneyAvailability {
  id: string;
  attorney_id: string;
  day_of_week: number; // 0 = Sun, 1 = Mon ...
  start_time: string; // "09:00"
  end_time: string; // "17:00"
  slot_duration_minutes: number;
  is_active: boolean;
}

export interface BlockedTimeSlot {
  id: string;
  attorney_id?: string; // null means firm-wide holiday
  date: string; // YYYY-MM-DD
  time_slot?: string; // null means whole day
  reason: string;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  client_name?: string;
  filename: string;
  storage_path: string;
  content_type: string;
  size_bytes: number;
  category: 'engagement' | 'pleading' | 'evidence' | 'identity' | 'general';
  is_confidential: boolean;
  uploaded_by_id: string;
  uploaded_by_name: string;
  created_at: string;
}

export interface InternalNote {
  id: string;
  entity_type: 'enquiry' | 'consultation' | 'client';
  entity_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id?: string;
  author_name: string;
  author_title: string;
  featured_image: string;
  read_time: string;
  is_published: boolean;
  published_at: string;
  tags: string[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_anonymized_title: string; // e.g. "Multinational FinTech Conglomerate"
  practice_area: string;
  challenge: string;
  strategy: string;
  outcome: string;
  lead_attorney_id?: string;
  is_published: boolean;
  featured: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title_org: string;
  quote: string;
  practice_area: string;
  is_approved: boolean;
  rating: number;
  created_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Consultations' | 'Fees & Retainers' | 'Confidentiality' | 'Corporate';
  sort_order: number;
}

export interface SiteSettings {
  firm_name: string;
  tagline: string;
  phone: string;
  email: string;
  emergency_phone?: string;
  main_office_address: string;
  secondary_office_address?: string;
  working_hours: string;
  disclaimer_text: string;
  conflict_screening_notice: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  user_role: string;
  action: string;
  entity: string;
  entity_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}
