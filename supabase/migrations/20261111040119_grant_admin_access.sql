/*
# Grant admin access to enquiries, consultations, and documents

1. Security Changes
- Grants `service_role` full CRUD on enquiries, consultations, and documents so the admin server route can read and update them.
- Adds admin-only SELECT policies to enquiries, consultations, and documents so admin staff using the authenticated client can see all records, not just their own.
- Profiles remain owner-only for clients; admins read all profiles through the service role in the admin route.

2. Important Notes
- Admin status is determined by the `profiles.role` column, which clients cannot edit.
- The admin server route verifies the caller's role before using the service role key for any write.
- No client-facing grants are broadened.
*/

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.enquiries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.consultations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.documents TO service_role;
GRANT SELECT ON TABLE public.profiles TO service_role;

DROP POLICY IF EXISTS "Admins can view all enquiries" ON public.enquiries;
CREATE POLICY "Admins can view all enquiries" ON public.enquiries
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;
CREATE POLICY "Admins can view all consultations" ON public.consultations
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;
CREATE POLICY "Admins can view all documents" ON public.documents
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
