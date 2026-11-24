/*
# Lock the public enquiry helper function

1. Security Changes
- Removes anonymous and authenticated EXECUTE access from `submit_public_enquiry`.
- The website now submits through its server route using the service role, keeping the privileged write path out of the public Data API.

2. Important Notes
- The existing function is retained to avoid destructive schema changes, but it is no longer callable by public roles.
- The `enquiries` table remains protected by row-level security and has no client-facing table grants.
*/

REVOKE EXECUTE ON FUNCTION public.submit_public_enquiry(text, text, text, text, text) FROM PUBLIC, anon, authenticated;
