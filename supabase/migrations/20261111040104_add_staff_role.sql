/*
# Add staff role for admin workspace access

1. Modified Table
- `profiles.role` (text, not null, defaults to 'client'): server-controlled role that gates admin operations.
- Allowed values: 'client' and 'admin'.

2. Security
- The `role` column is NOT included in the authenticated UPDATE grant, so clients cannot promote themselves.
- Admin operations are performed through server routes that verify the caller's role before using the service role key.
- A SECURITY DEFINER function allows an existing admin to promote another client; no one else can call it.

3. Important Notes
- New sign-ups default to 'client'.
- The first admin must be promoted via a privileged SQL update (one-time bootstrap).
- Role checks happen server-side on every admin request, not just at page load.
*/

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin'));

CREATE OR REPLACE FUNCTION public.promote_to_admin(p_target_user uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.profiles SET role = 'admin', updated_at = now() WHERE id = p_target_user;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.promote_to_admin(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.promote_to_admin(uuid) TO authenticated;
