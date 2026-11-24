/*
# Create private client profiles for account access

1. New Tables
- `profiles`
- `id` (uuid, primary key): references the Supabase auth user.
- `display_name` (text): client-controlled name shown in the portal.
- `phone` (text): optional client contact number.
- `created_at` (timestamptz): profile creation time.
- `updated_at` (timestamptz): last profile update time.

2. Security
- Row-level security is enabled on `profiles`.
- Only the signed-in owner can read or update their profile.
- Anonymous visitors receive no table access.
- Role and ownership fields are not client-writable.
- A secure signup trigger creates a profile row for new auth users.

3. Important Notes
- Passwords remain managed by Supabase Auth and are never stored in this table.
- Client accounts are separate from public enquiry intake until an authenticated linking workflow is added.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name, phone) ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

REVOKE EXECUTE ON FUNCTION public.create_profile_for_user() FROM PUBLIC, anon, authenticated;
