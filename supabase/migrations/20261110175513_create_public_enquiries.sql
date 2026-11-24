/*
# Create secure public enquiry intake

1. New Tables
- `enquiries`
- `id` (uuid, primary key): internal record identifier.
- `reference` (text, unique): client-facing enquiry reference such as AUR-20261110-AB12CD.
- `first_name` (text): visitor's first name.
- `last_name` (text): visitor's last name.
- `email` (text): visitor's contact email.
- `practice_area` (text): selected area of legal support.
- `message` (text): initial non-confidential enquiry summary.
- `status` (text): workflow status, initially `new`.
- `created_at` (timestamptz): submission time.
- `updated_at` (timestamptz): last update time.

2. Security
- Row-level security is enabled on `enquiries`.
- Anonymous visitors may submit through a controlled function only.
- Anonymous visitors cannot read, update, or delete enquiry records.
- The public function validates inputs and returns only the generated reference.
- The function uses a fixed search path and does not expose record contents.

3. Important Notes
- This is a single-tenant intake table for the public firm website.
- Admin and attorney workflows should be added behind authenticated, role-scoped policies in a later migration.
- Enquiry submissions do not create an attorney-client relationship.
*/

CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  practice_area text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'conflict_check', 'awaiting_client_response', 'consultation_scheduled', 'converted', 'closed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enquiries_status_created_at_idx ON public.enquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_email_idx ON public.enquiries (lower(email));

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.enquiries FROM anon, authenticated;
GRANT INSERT ON TABLE public.enquiries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.enquiries TO service_role;

CREATE OR REPLACE FUNCTION public.submit_public_enquiry(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_practice_area text,
  p_message text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reference text;
BEGIN
  IF length(trim(p_first_name)) < 1 OR length(trim(p_first_name)) > 80 THEN
    RAISE EXCEPTION 'Invalid first name';
  END IF;

  IF length(trim(p_last_name)) < 1 OR length(trim(p_last_name)) > 80 THEN
    RAISE EXCEPTION 'Invalid last name';
  END IF;

  IF length(trim(p_email)) < 3 OR length(trim(p_email)) > 254 OR position('@' IN p_email) < 2 THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;

  IF length(trim(p_practice_area)) < 1 OR length(trim(p_practice_area)) > 120 THEN
    RAISE EXCEPTION 'Invalid practice area';
  END IF;

  IF length(trim(p_message)) < 10 OR length(trim(p_message)) > 4000 THEN
    RAISE EXCEPTION 'Invalid message';
  END IF;

  v_reference := 'AUR-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  INSERT INTO public.enquiries (reference, first_name, last_name, email, practice_area, message)
  VALUES (v_reference, trim(p_first_name), trim(p_last_name), lower(trim(p_email)), trim(p_practice_area), trim(p_message));

  RETURN v_reference;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_public_enquiry(text, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_public_enquiry(text, text, text, text, text) TO anon, authenticated;
