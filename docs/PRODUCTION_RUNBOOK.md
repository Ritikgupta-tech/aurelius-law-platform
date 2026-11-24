# Aurelius & Co. — Production Runbook & Operations Manual

## 1. System Topology
- **Frontend / API:** Next.js 14 App Router hosted on **Vercel** (`aurelius-law-platform.vercel.app`)
- **Database & Auth:** Supabase PostgreSQL cluster hosted in **Singapore (`ap-southeast-1`)**
- **Storage Vault:** Supabase Encrypted Object Storage (`client-documents`)
- **Monitoring & Telemetry:** Vercel Runtime Logs + Supabase Database Metrics + Immutable `audit_logs`

---

## 2. Health Check & Diagnostics

### 2.1. Public Site Health
```bash
curl -I https://aurelius-law-platform.vercel.app
# Expected: HTTP/2 200 OK
```

### 2.2. API Gateway & Auth Check
```bash
curl https://aurelius-law-platform.vercel.app/api/auth/config
# Expected: {"url":"https://...","anonKey":"..."}
```

### 2.3. Consultation Availability Check
```bash
curl "https://aurelius-law-platform.vercel.app/api/consultations?date=2026-12-20&attorneyId=att-1"
# Expected: {"date":"2026-12-20","attorneyId":"att-1","availableSlots":[...]}
```

---

## 3. Incident Triage Runbook

### Incident A: 500 Server Error on Form Submissions
1. **Symptom:** User receives `We could not submit your enquiry. Please try again.`
2. **Diagnosis:**
   - Check Vercel Function Logs for `/api/enquiries` or `/api/consultations`.
   - Check Supabase Database CPU and connection pool usage in Supabase Dashboard.
3. **Remediation:**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are active.
   - If Supabase is momentarily paused or unreachable, the service layer automatically falls back to the in-memory database store so user submissions are never dropped.

### Incident B: 429 Too Many Requests
1. **Symptom:** Client receives `Rate limit exceeded. Please wait a moment...`
2. **Cause:** Client IP exceeded 15 requests in a 60-second window.
3. **Resolution:** Normal security protection behavior. If an executive IP address needs whitelisting, adjust `maxRequests` in `lib/rateLimit.ts`.

### Incident C: 403 Forbidden on Privileged Notes
1. **Symptom:** Client portal or third-party request receives `403 Forbidden`.
2. **Analysis:** Intentional security behavior under Legal Professional Privilege. Standard client accounts and unauthenticated users must never receive privileged internal case notes.

---

## 4. Maintenance & Routine Operations

1. **Viewing Audit Trail:**
   - Access `/admin` -> Module **Audit Logs**.
   - Or query via PostgreSQL: `SELECT * FROM public.audit_logs ORDER BY created_at DESC LIMIT 50;`
2. **Releasing Inactive Calendar Holds:**
   - Consultations in `pending` status older than 24 hours can be transitioned to `cancelled` via `/api/admin/status` to liberate calendar slots.
3. **Storage Quota Oversight:**
   - Periodically inspect storage usage in Supabase Storage under `client-documents`.
