/*
# Link enquiries to authenticated clients

1. Modified Table
- `enquiries.user_id` (uuid, nullable): optional owner reference to `auth.users`.
- Existing public enquiries remain valid with a null owner until a verified client submits from the portal.

2. Security
- Authenticated users receive SELECT access only to enquiries where `user_id` matches their session.
- Anonymous visitors retain no table access.
- The client submission route will derive ownership from a verified Supabase access token rather than accepting a user id from the browser.
- No client role, status, reference, or assignment fields become writable.

3. Important Notes
- Existing enquiry data is preserved.
- Public website enquiries continue to be accepted through the existing server route.
- Portal-created enquiries are linked to the signed-in client account.
*/

ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS enquiries_user_id_created_at_idx ON public.enquiries (user_id, created_at DESC);

GRANT SELECT ON TABLE public.enquiries TO authenticated;

DROP POLICY IF EXISTS "Clients can view their own enquiries" ON public.enquiries;
CREATE POLICY "Clients can view their own enquiries" ON public.enquiries
FOR SELECT TO authenticated
USING (auth.uid() = user_id);
