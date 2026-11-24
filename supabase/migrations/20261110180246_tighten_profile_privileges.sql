/*
# Tighten client profile privileges

1. Security Changes
- Revokes inherited table-wide privileges from anonymous and authenticated roles.
- Grants authenticated users only SELECT and UPDATE access needed by the portal.
- Restricts updates to `display_name` and `phone` columns.
- Keeps row-level ownership policies as the final access check.

2. Important Notes
- Anonymous visitors cannot access profile records.
- Authenticated users can only access their own profile row.
- Profile identity and timestamps remain server-controlled.
*/

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (display_name, phone) ON TABLE public.profiles TO authenticated;
