# Application Security & Legal Compliance Architecture

## Threat Model & Security Posture

As a legal services platform, the application handles highly sensitive personal, commercial, and financial information. The security architecture adheres to least-privilege principles, legal professional privilege isolation, and strict data sanitization.

### 1. Row Level Security (RLS)
Every table exposed through PostgreSQL is secured via Supabase RLS:
- **`internal_notes`**: Blocked entirely from public or client access. Only accounts with verified `admin`, `super_admin`, or `attorney` roles can select or insert.
- **`documents`**: Clients can only view and query documents residing within their assigned directory (`storage.foldername(name)[1] = auth.uid()`).
- **`audit_logs`**: Strictly append-only for operations; select grants are restricted to `super_admin` and `admin` roles.

### 2. Attorney-Client Privilege Protection
- Non-confidential intake disclaimers are visibly presented prior to submission.
- Clients are explicitly instructed not to transmit proprietary source code or trial work product until conflict clearance is achieved.
- Submitting an inquiry does not create an attorney-client relationship, shielding the firm from disqualification attempts by bad actors seeking to create synthetic conflicts.

### 3. File Upload Defense
- **Size Restriction**: Hard limit of 10 MB per file.
- **MIME Whitelist**: Strictly restricts uploads to:
  - `application/pdf`
  - `application/msword`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `image/png`, `image/jpeg`, `image/webp`
- **Sanitized Filenames**: Raw filenames are mapped to UUID storage keys (`user_id/uuid.ext`) to prevent path traversal and arbitrary execution.

### 4. Injection & Cross-Site Scripting (XSS)
- Input strings are trimmed, length-bounded, and validated via strict TypeScript and Zod schemas.
- Database operations utilize parameterized queries and ORM abstractions to eliminate SQL injection risks.
