/*
# Create private client document vault

1. New Tables
- `documents`
- `id` (uuid, primary key): document metadata identifier.
- `user_id` (uuid, not null, defaults to authenticated user): owner reference.
- `filename` (text): original filename provided by the client.
- `storage_path` (text): path inside the private client-documents bucket.
- `content_type` (text): MIME type captured at upload.
- `size_bytes` (bigint): file size in bytes.
- `category` (text): client-selected grouping (identity, financial, contracts, other).
- `created_at` (timestamptz): upload time.

2. New Storage
- Private bucket `client-documents` for client-uploaded files.
- Storage policies enforce that authenticated users can only manage objects inside their own user-id folder.

3. Security
- `documents` has RLS enabled; clients can read, insert, and delete only their own rows.
- `user_id` defaults to `auth.uid()` so client inserts that omit it still satisfy the ownership check.
- Storage policies scope read/write/delete to `auth.uid()/...` object paths.
- Anonymous visitors have no access to the table or bucket.
- File size and type validation happen in the upload route before the object is written.

4. Important Notes
- Files are served via short-lived signed URLs, never public bucket URLs.
- The bucket is private; guessing a path is not enough to retrieve a file.
*/

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  storage_path text NOT NULL,
  content_type text NOT NULL DEFAULT 'application/octet-stream',
  size_bytes bigint NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('identity', 'financial', 'contracts', 'correspondence', 'other')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_user_id_created_at_idx ON public.documents (user_id, created_at DESC);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.documents FROM anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.documents TO authenticated;

DROP POLICY IF EXISTS "Clients can view their own documents" ON public.documents;
CREATE POLICY "Clients can view their own documents" ON public.documents
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can insert their own documents" ON public.documents;
CREATE POLICY "Clients can insert their own documents" ON public.documents
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can delete their own documents" ON public.documents;
CREATE POLICY "Clients can delete their own documents" ON public.documents
FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'client-documents', 'client-documents', false, 10485760, ARRAY['application/pdf','image/png','image/jpeg','image/webp','application/msword','application/vnd.open-images','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'client-documents');

DROP POLICY IF EXISTS "Clients can read their own documents" ON storage.objects;
CREATE POLICY "Clients can read their own documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'client-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Clients can upload their own documents" ON storage.objects;
CREATE POLICY "Clients can upload their own documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'client-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Clients can delete their own documents" ON storage.objects;
CREATE POLICY "Clients can delete their own documents" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'client-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
