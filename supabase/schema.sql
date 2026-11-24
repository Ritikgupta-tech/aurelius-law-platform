-- ====================================================================
-- AURELIUS & CO. — COMPREHENSIVE PRODUCTION LAW FIRM SCHEMA & RLS
-- File: supabase/schema.sql
-- Standalone, fully idempotent setup for fresh Supabase projects.
-- Covers all 25 Entities, Auth Triggers, Storage, and Seed Data.
-- ====================================================================

-- 1. ROLES & PROFILES
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

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'staff', 'attorney', 'admin', 'super_admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id text NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_key)
);

-- Profile trigger on auth.users
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''), 'client')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

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

-- 6. ENQUIRIES (Self-contained creation)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_contact_method text DEFAULT 'email',
  practice_area text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'conflict_check', 'awaiting_client_response', 'consultation_scheduled', 'converted', 'closed', 'rejected')),
  conflict_status text DEFAULT 'pending' CHECK (conflict_status IN ('pending', 'cleared', 'flagged')),
  conflict_notes text,
  assigned_attorney_id text REFERENCES public.attorneys(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status_created_at ON public.enquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON public.enquiries (lower(email));

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

-- 10. CONSULTATIONS (Self-contained creation)
CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name text,
  client_email text,
  client_phone text,
  attorney_id text REFERENCES public.attorneys(id) ON DELETE SET NULL,
  practice_area text NOT NULL,
  consultation_type text NOT NULL CHECK (consultation_type IN ('online', 'in_person', 'phone')),
  scheduled_date date,
  preferred_date date,
  time_slot text,
  preferred_time text,
  timezone text NOT NULL DEFAULT 'UTC',
  meeting_link text,
  location text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'reschedule_requested', 'cancelled', 'completed', 'no_show')),
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultations_scheduled ON public.consultations(scheduled_date, time_slot, status);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id, created_at DESC);

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

-- 13. DOCUMENTS (Self-contained creation)
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  storage_path text NOT NULL,
  content_type text NOT NULL DEFAULT 'application/octet-stream',
  size_bytes bigint NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('identity', 'financial', 'contracts', 'correspondence', 'court_filing', 'other')),
  is_confidential boolean DEFAULT true,
  uploaded_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id, created_at DESC);

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
-- SEED DATA (All 15 Practice Areas & Key Attorneys)
-- ====================================================================

INSERT INTO public.practice_areas (id, slug, title, short_description, full_description, icon_name, featured_image, key_services, typical_matters, sort_order) VALUES
  ('pa-corp', 'corporate-commercial', 'Corporate & Commercial Law', 'Strategic advisory for enterprise transactions and cross-border M&A.', 'Full service corporate representation from institutional funding to cross-border mergers.', 'Building2', 'https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg', ARRAY['Cross-Border M&A', 'Corporate Structuring', 'Joint Ventures'], ARRAY['$420M cross-border acquisition', '$75M joint venture'], 1),
  ('pa-formation', 'business-formation', 'Business Formation & Registration', 'Entity incorporation, founder agreements, and governance frameworks.', 'Comprehensive establishment of corporate structures in key global financial centers.', 'BriefcaseBusiness', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg', ARRAY['Entity Structuring', 'Shareholder Pacts', 'Foreign Entity Registration'], ARRAY['Holding company restructuring across 3 jurisdictions'], 2),
  ('pa-contracts', 'contract-drafting', 'Contract Drafting & Negotiation', 'Forensic commercial agreements, risk mitigation, and bilateral covenants.', 'Drafting and high-stakes negotiation of institutional commercial contracts.', 'FileText', 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg', ARRAY['Master Services Agreements', 'Licensing Deals', 'Bilateral Supply Pacts'], ARRAY['$120M long-term procurement covenant'], 3),
  ('pa-ip', 'intellectual-property', 'Intellectual Property Rights', 'Global patent prosecution, trade secret defense, and technology portfolios.', 'Global portfolio defense across common law and international registries.', 'Sparkles', 'https://images.pexels.com/photos/8112170/pexels-photo-8112170.jpeg', ARRAY['Patent Prosecution', 'Trade Secret Litigation', 'Technology Transfer'], ARRAY['Defended core AI architecture patents in international tribunal'], 4),
  ('pa-trademark', 'trademark-copyright', 'Trademark & Copyright Law', 'Brand portfolio defense, anti-counterfeiting, and IP enforcement.', 'Comprehensive brand asset defense across international jurisdictions.', 'Award', 'https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg', ARRAY['Madrid Protocol Filings', 'Opposition Proceedings', 'Brand Protection'], ARRAY['Worldwide brand defense across 45 national registries'], 5),
  ('pa-litigation', 'civil-litigation', 'Civil Litigation & Trials', 'High-stakes trial advocacy in commercial, equity, and appellate courts.', 'Commanding representation in commercial trials and appellate litigation.', 'Scale', 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg', ARRAY['Commercial Breach Claims', 'Shareholder Injunctions', 'Appellate Litigation'], ARRAY['Secured full dismissal of $85M breach of fiduciary claim'], 6),
  ('pa-criminal', 'criminal-defense', 'White Collar Defense & Investigations', 'Government investigations, corporate fraud defense, and regulatory enforcement.', 'Strategic defense in high-stakes regulatory and government inquiries.', 'ShieldCheck', 'https://images.pexels.com/photos/6077381/pexels-photo-6077381.jpeg', ARRAY['Internal Corporate Inquiries', 'Securities Defense', 'Cross-Border Sanctions'], ARRAY['Internal investigation for multinational banking consortium'], 7),
  ('pa-family', 'family-matrimonial', 'Family & Matrimonial Law', 'High-net-worth matrimonial dissolution, custody, and prenuptials.', 'Discreet counsel for multi-jurisdictional family estates and dynasties.', 'Users', 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg', ARRAY['Pre-Marital Wealth Structuring', 'Cross-Border Custody', 'Family Dynasty Trusts'], ARRAY['Negotiated pre-marital covenant safeguarding $180M family estate'], 8),
  ('pa-realestate', 'real-estate-property', 'Real Estate & Property Law', 'Institutional acquisitions, commercial leasing, and zoning development.', 'Comprehensive property counsel for private investors and sovereign developers.', 'Landmark', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', ARRAY['Commercial Acquisitions', 'Zoning & Permitting', 'Development Joint Ventures'], ARRAY['Structured $210M prime urban commercial portfolio acquisition'], 9),
  ('pa-employment', 'employment-labour', 'Employment & Labour Law', 'Executive severance, cross-border transfers, and workplace compliance.', 'Counseling management on executive contracts and complex labor disputes.', 'BriefcaseBusiness', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', ARRAY['C-Suite Compensation', 'Restrictive Covenants', 'Class Action Defense'], ARRAY['Engineered executive transition package for FTSE 100 enterprise'], 10),
  ('pa-tax', 'taxation-compliance', 'Taxation & Regulatory Compliance', 'Cross-border tax structuring, transfer pricing, and treaty planning.', 'Strategic counsel navigating domestic and international tax frameworks.', 'TrendingUp', 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg', ARRAY['Cross-Border Tax Treaties', 'BEPS Compliance', 'Tax Controversy'], ARRAY['Restructured European operating entity saving $14M annually'], 11),
  ('pa-docs', 'legal-documentation', 'Legal Documentation & Notarial', 'Apostilles, statutory declarations, and sovereign affidavits.', 'Authentication and statutory execution of international legal instruments.', 'FileText', 'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg', ARRAY['International Apostille', 'Corporate Resolutions', 'Cross-Border Affidavits'], ARRAY['Expedited execution of 300+ statutory filings for international merger'], 12),
  ('pa-startup', 'startup-advisory', 'Startup & Venture Advisory', 'SAFEs, Series financing, cap-table governance, and spinouts.', 'Holistic legal advisory for high-velocity founders and institutional venture funds.', 'Sparkles', 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg', ARRAY['Seed & Series Financing', 'Option Pool Architectures', 'Founder Governance'], ARRAY['Guided tech startup from pre-seed through $28M Series A financing'], 13),
  ('pa-dispute', 'dispute-resolution', 'Arbitration & Alternative Dispute', 'LCIA, ICC, and SIAC institutional international arbitration.', 'Private tribunal advocacy resolving cross-border sovereign and commercial claims.', 'Scale', 'https://images.pexels.com/photos/5668481/pexels-photo-5668481.jpeg', ARRAY['LCIA / ICC Arbitration', 'Emergency Arbitrator Relief', 'Treaty Arbitration'], ARRAY['Represented sovereign energy consortium in $340M arbitration'], 14),
  ('pa-consult', 'legal-consultation', 'Strategic Legal Advisory', 'General counsel services, board advisory, and crisis leadership.', 'Embedded advisory counsel for boards and executive leadership during transformational events.', 'Building2', 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg', ARRAY['Boardroom Strategic Counsel', 'Crisis Mitigation', 'Fiduciary Audits'], ARRAY['Retained as independent advisory counsel to banking board during reorganization'], 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.attorneys (id, full_name, slug, title, designation, email, phone, office_location, bar_admissions, education, bio, experience_years, photo_url, is_active, featured) VALUES
  ('att-1', 'Arthur Sterling, KC', 'arthur-sterling', 'King''s Counsel · Senior Managing Partner', 'Senior Managing Partner', 'a.sterling@aureliuslaw.com', '+44 20 7946 0912', 'London & New York Chambers', ARRAY['English Bar (King''s Counsel)', 'New York State Bar', 'DIFC Courts'], ARRAY['MA (Law), University of Oxford', 'LL.M., Harvard Law School'], 'Arthur Sterling KC commands international recognition for high-stakes commercial litigation and cross-border M&A defense.', 26, 'https://images.pexels.com/photos/38139419/pexels-photo-38139419.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900', true, true),
  ('att-2', 'Elena Rostova, LL.M.', 'elena-rostova', 'Partner · International Private Client & Real Estate', 'Partner', 'e.rostova@aureliuslaw.com', '+41 22 555 0194', 'Zurich & London Chambers', ARRAY['Zurich Bar Association', 'Solicitor of England and Wales'], ARRAY['Lic. iur., University of Zurich', 'LL.M., London School of Economics'], 'Elena Rostova specializes in cross-border wealth governance, private trusts, and high-value real estate development.', 18, 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900', true, true),
  ('att-3', 'Marcus Vance, Esq.', 'marcus-vance', 'Partner · Cross-Border IP, Tech & Antitrust', 'Partner', 'm.vance@aureliuslaw.com', '+1 212 555 0188', 'New York Chambers', ARRAY['New York State Bar', 'US Patent and Trademark Office', 'Federal Circuit'], ARRAY['BS in Computer Science, MIT', 'JD, Columbia Law School'], 'Marcus Vance represents leading technology enterprises, semiconductor innovators, and venture capital syndicates.', 16, 'https://images.pexels.com/photos/8112170/pexels-photo-8112170.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900', true, true),
  ('att-4', 'Alistair Finch, KC', 'alistair-finch', 'Partner · Commercial Litigation & White Collar Defense', 'Partner', 'a.finch@aureliuslaw.com', '+44 20 7946 0914', 'London Chambers', ARRAY['English Bar (King''s Counsel)', 'Arbitrator (LCIA Roster)'], ARRAY['BA, University of Cambridge', 'BCL, University of Oxford'], 'Alistair Finch KC has defended major financial institutions and executive leadership in complex international trials.', 22, 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900', true, true)
ON CONFLICT (id) DO NOTHING;

-- Seed FAQs
INSERT INTO public.faqs (id, question, answer, category, sort_order) VALUES
  ('faq-1', 'How does your ethical conflict screening protocol operate?', 'Before accepting confidential matter documentation or conducting strategic consultations, our intake team verifies all adverse parties against our proprietary conflict registry. If an ethical conflict exists, we immediately notify the inquiring party and decline representation without disclosure of conflicting client matters.', 'Ethics & Intake', 1),
  ('faq-2', 'Does submitting an enquiry create an attorney-client relationship?', 'No. Submitting an enquiry or booking an initial consultation does not form a formal attorney-client relationship. An attorney-client relationship is formally established only after successful conflict clearance and bilateral execution of our Engagement Letter.', 'Ethics & Intake', 2),
  ('faq-3', 'What are your retainer models and billing structures?', 'We offer structured phased retainers, milestone-based capped billing, and transparent hourly rates depending on the complexity, jurisdictional breadth, and urgency of the matter. Every retainer is documented with unambiguous deliverable milestones.', 'Retainers & Fees', 3),
  ('faq-4', 'Can consultations be conducted internationally via encrypted video?', 'Yes. All consultations are available via our encrypted client portal with high-definition video conferencing, or in-person across our London, New York, Zurich, and Singapore chambers.', 'Consultations', 4)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- STORAGE BUCKET FOR CLIENT DOCUMENTS
-- ====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-documents',
  'client-documents',
  false,
  10485760,
  ARRAY['application/pdf','image/png','image/jpeg','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users view/update their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Public readable published tables
DROP POLICY IF EXISTS "Public can view active practice areas" ON public.practice_areas;
CREATE POLICY "Public can view active practice areas" ON public.practice_areas FOR SELECT TO PUBLIC USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active attorneys" ON public.attorneys;
CREATE POLICY "Public can view active attorneys" ON public.attorneys FOR SELECT TO PUBLIC USING (is_active = true);

DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT TO PUBLIC USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published case studies" ON public.case_studies;
CREATE POLICY "Public can view published case studies" ON public.case_studies FOR SELECT TO PUBLIC USING (is_published = true);

DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT TO PUBLIC USING (is_approved = true);

DROP POLICY IF EXISTS "Public can view faqs" ON public.faqs;
CREATE POLICY "Public can view faqs" ON public.faqs FOR SELECT TO PUBLIC USING (true);

-- Consultations: Clients can view their own consultations
DROP POLICY IF EXISTS "Clients can view their own consultations" ON public.consultations;
CREATE POLICY "Clients can view their own consultations" ON public.consultations FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Documents: Clients can view/insert their own documents
DROP POLICY IF EXISTS "Clients can view their own documents" ON public.documents;
CREATE POLICY "Clients can view their own documents" ON public.documents FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can insert their own documents" ON public.documents;
CREATE POLICY "Clients can insert their own documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Enquiries: Anyone can submit through public API; service_role reads/writes
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.enquiries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.consultations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.audit_logs TO service_role;

-- Storage RLS
DROP POLICY IF EXISTS "Clients can read their own documents" ON storage.objects;
CREATE POLICY "Clients can read their own documents" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'client-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Clients can upload their own documents" ON storage.objects;
CREATE POLICY "Clients can upload their own documents" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'client-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
