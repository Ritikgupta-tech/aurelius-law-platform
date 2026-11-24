-- ====================================================================
-- AURELIUS & CO. — COMPREHENSIVE PRODUCTION LAW FIRM SCHEMA & RLS
-- Migration: 20261124120000_complete_law_firm_schema.sql
-- Covers all 25 Entities with Foreign Keys, Constraints, Indexes & Policies
-- ====================================================================

-- 1. ROLES & PERMISSIONS
CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.roles (id, description) VALUES
  ('super_admin', 'Supreme firm administrator with full configuration and user authority'),
  ('admin', 'Operations and legal practice administrator'),
  ('attorney', 'Licensed legal practitioner with assigned matters and consultation access'),
  ('staff', 'Paralegal and administrative intake staff'),
  ('client', 'Authenticated client with private portal access')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id text NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_key)
);

-- 2. PRACTICE AREAS
CREATE TABLE IF NOT EXISTS public.practice_areas (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Scale',
  featured_image text NOT NULL,
  key_services text[] NOT NULL DEFAULT '{}',
  typical_matters text[] NOT NULL DEFAULT '{}',
  lead_attorney_id text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_areas_slug ON public.practice_areas(slug);
CREATE INDEX IF NOT EXISTS idx_practice_areas_active ON public.practice_areas(is_active, sort_order);

-- 3. ATTORNEYS
CREATE TABLE IF NOT EXISTS public.attorneys (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  designation text NOT NULL,
  primary_practice_id text REFERENCES public.practice_areas(id) ON DELETE SET NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  office_location text NOT NULL,
  bar_admissions text[] NOT NULL DEFAULT '{}',
  education text[] NOT NULL DEFAULT '{}',
  bio text NOT NULL,
  quote text,
  experience_years integer NOT NULL DEFAULT 10,
  photo_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attorneys_slug ON public.attorneys(slug);
CREATE INDEX IF NOT EXISTS idx_attorneys_active ON public.attorneys(is_active, featured);

-- 4. ATTORNEY PRACTICE AREAS (M:N)
CREATE TABLE IF NOT EXISTS public.attorney_practice_areas (
  attorney_id text NOT NULL REFERENCES public.attorneys(id) ON DELETE CASCADE,
  practice_area_id text NOT NULL REFERENCES public.practice_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (attorney_id, practice_area_id)
);

-- 5. CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  identification_number text,
  billing_address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. ENQUIRIES (Enhanced with conflict status & attorney assignment)
-- (enquiries table already partially exists in earlier migrations, add missing columns safely)
ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS conflict_status text DEFAULT 'pending' CHECK (conflict_status IN ('pending', 'cleared', 'flagged')),
  ADD COLUMN IF NOT EXISTS conflict_notes text,
  ADD COLUMN IF NOT EXISTS assigned_attorney_id text REFERENCES public.attorneys(id) ON DELETE SET NULL;

-- 7. ENQUIRY ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.enquiry_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  attorney_id text NOT NULL REFERENCES public.attorneys(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  assigned_at timestamptz NOT NULL DEFAULT now()
);

-- 8. ENQUIRY ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.enquiry_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  performed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. CONFLICT CHECKS
CREATE TABLE IF NOT EXISTS public.conflict_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid REFERENCES public.enquiries(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  opposing_parties text[] NOT NULL DEFAULT '{}',
  adverse_parties text[] NOT NULL DEFAULT '{}',
  checked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  result text NOT NULL CHECK (result IN ('cleared', 'flagged', 'blocked')),
  findings text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. CONSULTATIONS (Enhanced with conflict, link & attorney references)
ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS attorney_id text REFERENCES public.attorneys(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS meeting_link text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS client_email text,
  ADD COLUMN IF NOT EXISTS client_phone text;

CREATE INDEX IF NOT EXISTS idx_consultations_date_time ON public.consultations(scheduled_date, time_slot, status);

-- 11. ATTORNEY AVAILABILITY
CREATE TABLE IF NOT EXISTS public.attorney_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attorney_id text NOT NULL REFERENCES public.attorneys(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 60,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(attorney_id, day_of_week)
);

-- 12. BLOCKED TIME SLOTS (Double-booking prevention & firm holidays)
CREATE TABLE IF NOT EXISTS public.blocked_time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attorney_id text REFERENCES public.attorneys(id) ON DELETE CASCADE,
  blocked_date date NOT NULL,
  time_slot text,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blocked_slots ON public.blocked_time_slots(attorney_id, blocked_date);

-- 13. DOCUMENTS (Already partially created, ensure flags and audit)
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS is_confidential boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS uploaded_by_name text;

-- 14. DOCUMENT ACCESS LOGS
CREATE TABLE IF NOT EXISTS public.document_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  accessed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text,
  access_type text NOT NULL DEFAULT 'download',
  accessed_at timestamptz NOT NULL DEFAULT now()
);

-- 15. INTERNAL NOTES (Privileged Attorney/Admin Notes - strictly hidden from clients)
CREATE TABLE IF NOT EXISTS public.internal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('enquiry', 'consultation', 'client')),
  entity_id text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internal_notes_entity ON public.internal_notes(entity_type, entity_id);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 17. BLOG POSTS & CATEGORIES
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.blog_categories (id, name) VALUES
  ('briefing', 'Briefing'),
  ('perspective', 'Perspective'),
  ('guide', 'Guide'),
  ('regulatory', 'Regulatory Update')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  author_id text REFERENCES public.attorneys(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  author_title text NOT NULL,
  featured_image text NOT NULL,
  read_time text NOT NULL DEFAULT '5 min read',
  tags text[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(is_published, published_at DESC);

-- 18. CASE STUDIES
CREATE TABLE IF NOT EXISTS public.case_studies (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client_anonymized_title text NOT NULL,
  practice_area text NOT NULL,
  challenge text NOT NULL,
  strategy text NOT NULL,
  outcome text NOT NULL,
  lead_attorney_id text REFERENCES public.attorneys(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);

-- 19. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id text PRIMARY KEY,
  client_name text NOT NULL,
  client_title_org text NOT NULL,
  quote text NOT NULL,
  practice_area text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 20. FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
  id text PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 21. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 22. AUDIT LOGS (Immutable record of administrative actions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  user_email text NOT NULL,
  user_role text NOT NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  details text,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.practice_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public can view active practice areas" ON public.practice_areas FOR SELECT TO PUBLIC USING (is_active = true);
CREATE POLICY "Public can view active attorneys" ON public.attorneys FOR SELECT TO PUBLIC USING (is_active = true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT TO PUBLIC USING (is_published = true);
CREATE POLICY "Public can view published case studies" ON public.case_studies FOR SELECT TO PUBLIC USING (is_published = true);
CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT TO PUBLIC USING (is_approved = true);
CREATE POLICY "Public can view faqs" ON public.faqs FOR SELECT TO PUBLIC USING (true);

-- Internal notes are privileged and NEVER accessible to public or standard clients
CREATE POLICY "Staff and Admins can view internal notes" ON public.internal_notes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney')));
CREATE POLICY "Staff and Admins can create internal notes" ON public.internal_notes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'attorney')));

-- Audit logs are strictly readable by administrators
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
