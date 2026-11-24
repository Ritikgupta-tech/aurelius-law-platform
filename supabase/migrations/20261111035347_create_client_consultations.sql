/*
# Create private consultation requests

1. New Tables
- `consultations`
- `id` (uuid, primary key): internal appointment request identifier.
- `reference` (text, unique): client-facing consultation reference.
- `user_id` (uuid): authenticated client owner.
- `practice_area` (text): requested legal area.
- `consultation_type` (text): online, in-person, or phone.
- `preferred_date` (date): requested consultation date.
- `preferred_time` (text): requested local time window.
- `timezone` (text): client-provided IANA timezone label.
- `message` (text): short non-confidential context.
- `status` (text): pending, confirmed, reschedule_requested, cancelled, completed, or no_show.
- `created_at` and `updated_at` (timestamptz): lifecycle timestamps.

2. Security
- Row-level security is enabled.
- Authenticated clients can only read their own consultation requests.
- No direct client insert/update/delete grants are provided; server routes verify the access token and write with the service role.
- Consultation requests are never shown as confirmed before staff approval.

3. Important Notes
- The initial release records preferred times rather than claiming real-time availability.
- Calendar availability, conflict prevention, and staff approval can be layered onto this durable request record.
*/

CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_area text NOT NULL,
  consultation_type text NOT NULL CHECK (consultation_type IN ('online', 'in_person', 'phone')),
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  timezone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'reschedule_requested', 'cancelled', 'completed', 'no_show')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS consultations_user_id_created_at_idx ON public.consultations (user_id, created_at DESC);
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.consultations FROM anon, authenticated;
GRANT SELECT ON TABLE public.consultations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.consultations TO service_role;

DROP POLICY IF EXISTS "Clients can view their own consultations" ON public.consultations;
CREATE POLICY "Clients can view their own consultations" ON public.consultations
FOR SELECT TO authenticated USING (auth.uid() = user_id);
