# AURELIUS & CO. — COMPREHENSIVE SECURITY AUDIT & THREAT MODEL
**Audit Scope:** OWASP Top 10, ASVS Level 2, Legal Data Privacy & Fiduciary Compliance  
**Auditor:** Application Security & Compliance Architecture Team  
**Assessment Date:** November 2026  

---

## 1. Threat Modeling & Vulnerability Findings

### Finding 1: In-Memory Relational State across Serverless Functions (High Risk)
- **Vulnerability:** The application stored inquiries, consultations, and privileged notes in-memory. In a serverless environment (Vercel), separate instances and cold starts lose newly created records or create divergent state across instances.
- **Remediation:** Wire all mutations to persistent Supabase PostgreSQL using connection pooling and transactions.

### Finding 2: Client-Side Authentication State in Portals (High Risk)
- **Vulnerability:** The Client Portal (`app/portal/page.tsx`) initialized `isAuthenticated = true` with a demo user `client-usr-101`, and `handleLogin` simulated credentials in-memory without verifying Supabase Auth JWTs.
- **Remediation:** Integrate Supabase Auth SDK (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`, `supabase.auth.getSession`) with session cookie persistence.

### Finding 3: Privileged Notes Isolation at the API Layer (Critical Legal Risk)
- **Vulnerability:** Attorney-client privilege requires that internal legal assessments and conflict opinions are strictly air-gapped from client users. Exposing internal notes over public API endpoints creates severe malpractice exposure.
- **Remediation:** Ensure `/api/client/*` endpoints never query or return rows from `internal_notes`. Enforce `entity_type` and attorney/admin role verification on `/api/admin/notes`.

### Finding 4: Insecure Direct Object References (IDOR) on Inquiries & Consultations (High Risk)
- **Vulnerability:** `/api/consultations?userId=X` and `/api/enquiries?userId=X` allowed requesting client matters by supplying an arbitrary `userId` parameter without verifying that the requesting session matches `userId`.
- **Remediation:** Verify authenticated JWT session (`auth.uid()`) on the server. If a non-admin user requests records, enforce `user_id = session.user.id`.

### Finding 5: Rate Limiting & Denial of Service Protection on Public Intake (Medium Risk)
- **Vulnerability:** The public inquiry intake endpoint `POST /api/enquiries` and consultation booking `POST /api/consultations` were vulnerable to automated spam bot exhaustion.
- **Remediation:** Implement IP-based sliding-window rate limiting (maximum 10 requests per minute per IP address).

### Finding 6: HTTP Security Headers & Content Security Policy (Medium Risk)
- **Vulnerability:** Missing standard HTTP security headers (`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and CSP).
- **Remediation:** Configure declarative security headers in `next.config.js`.

---

## 2. OWASP Top 10 Remediation Status Matrix

| OWASP Category | Vulnerability Surface | Implemented Security Control | Status |
| :--- | :--- | :--- | :--- |
| **A01: Broken Access Control** | IDOR on consultations & documents | Server-side JWT ownership check (`auth.uid()`) | Remediating |
| **A02: Cryptographic Failures** | Document storage transmission | TLS 1.3 in-transit; short-lived signed URLs (15m) | Remediating |
| **A03: Injection (SQL / XSS)** | Dynamic queries and user inputs | Parameterized Supabase queries; input sanitation | Remediated |
| **A04: Insecure Design** | Ethical conflict screening | Mandatory pre-consultation conflict verification | Implemented |
| **A05: Security Misconfiguration**| HTTP security headers | HSTS, Frame-Options, X-Content-Type in Next config | Remediating |
| **A06: Vulnerable Components** | Dependencies & peer-deps | Vitest, Next.js 13.5, Supabase JS pinned | Remediated |
| **A07: Identification & Auth** | Portal authentication | Supabase Auth JWTs + secure session handling | Remediating |
| **A08: Software & Data Integrity**| Document uploads | Restricted MIME types; size cap (10MB); no `.exe` | Implemented |
| **A09: Security Logging** | Audit trail of admin actions | Append-only `audit_logs` recording user, IP, action | Implemented |
| **A10: Server-Side Request Forgery**| Meeting link webhooks | Sanitized URLs; no outbound arbitrary SSRF | Implemented |
