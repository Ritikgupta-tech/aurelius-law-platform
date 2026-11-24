# AURELIUS & CO. — FEATURE COMPLETION MATRIX
**Audit Date:** November 2026  
**Standards:** Full User Journey, Server Validation, Database Persistence, Authorization Enforcement  

---

## Complete Feature Inventory

| Area / Feature | Component / Route | Current State | Required Technical Action |
| :--- | :--- | :--- | :--- |
| **Split-Screen Hero** | `app/page.tsx` | **Complete & Verified** | Responsive layout & imagery verified. |
| **Market Pulse Ticker** | `components/MarketPulseTicker.tsx` | **Complete & Verified** | Live cycling metrics across 6 legal benchmarks. |
| **Global Chambers Clock** | `components/GlobalChambers.tsx` | **Complete & Verified** | Active session indicators across 6 global hubs. |
| **Practice Matrix** | `app/page.tsx` | **Complete & Verified** | Interactive tabbed filtering across 15 disciplines. |
| **Practice Dynamic Detail** | `app/practice-areas/[slug]/page.tsx` | **Complete & Verified** | 15 SSG routes with service scopes and booking handoff. |
| **Matter Compass Diagnostic** | `components/MatterCompass.tsx` | **Complete & Verified** | 4-step diagnostic generating real-time strategic counsel blueprints. |
| **Firm Distinction Table** | `components/FirmComparison.tsx` | **Complete & Verified** | High-contrast comparison table & mobile card stack. |
| **Landmark Deals Telemetry** | `components/LandmarkDeals.tsx` | **Complete & Verified** | Filterable precedent ledger (£1.42B takeover, $820M treaty). |
| **Fee & Retainer Estimator** | `components/FeeEstimator.tsx` | **Complete & Verified** | Multi-currency retainer calculator with booking handoff. |
| **Conflict Simulator** | `components/ConflictSimulator.tsx` | **Complete & Verified** | 4-step interactive adversary scan simulator. |
| **Attorney Directory** | `app/attorneys/page.tsx` | **Complete & Verified** | Search & designation filter across partner roster. |
| **Attorney Dynamic Profiles** | `app/attorneys/[slug]/page.tsx` | **Complete & Verified** | Dynamic partner bios, bar admissions, and credentials. |
| **Case Studies Showcase** | `app/case-studies/page.tsx` | **Complete & Verified** | Challenge, strategy, and outcome breakdowns. |
| **Insights Legal Journal** | `app/insights/page.tsx` | **Complete & Verified** | Category filtering, reading times, and author profiles. |
| **Public Intake Form** | `app/page.tsx#contact` | **Complete & Verified** | Submits to `/api/enquiries`, returns unique reference token. |
| **Consultation Booking Engine**| `app/book-consultation/page.tsx` | **Partially Implemented** | Slot generation works; wire persistence to Supabase `consultations`. |
| **Client Portal Auth** | `app/portal/page.tsx` | **Mock / Simulated** | Replace demo state with live Supabase Auth login/signup. |
| **Client Matter Tracking** | `app/portal/page.tsx` | **Partially Implemented** | Filter live user matters via `user_id` query to Supabase. |
| **Document Vault Upload** | `app/portal/page.tsx` | **Mock / Simulated** | Wire real file upload to Supabase Storage `client-documents`. |
| **Document Signed Downloads** | `app/portal/page.tsx` | **Mock / Simulated** | Generate short-lived (15m) signed download URLs. |
| **Attorney Auth & Selection** | `app/attorney/page.tsx` | **Partially Implemented** | Restrict workspace to verified attorney/admin users. |
| **Privileged Internal Notes** | `app/attorney/page.tsx` | **Partially Implemented** | Save notes to `internal_notes` table; verify RLS client exclusion. |
| **Admin Analytics Overview** | `app/admin/page.tsx` | **Complete & Verified** | Dynamic KPI metrics computed from live matter counts. |
| **Admin Status Mutations** | `app/admin/page.tsx` | **Complete & Verified** | Updates enquiry and consultation lifecycles via `/api/admin/status`. |
| **Admin CMS (Attorneys/Blog)**| `app/admin/page.tsx` | **Complete & Verified** | Modals and mutations operational. |
| **Admin Audit Trail** | `app/admin/page.tsx` | **Partially Implemented** | Persist audit logs to PostgreSQL `audit_logs` table. |
| **CSV Export Engine** | `app/api/admin/download/route.ts` | **Complete & Verified** | Exports inquiries, consultations, or audit logs as CSV. |
| **Security Headers & CSP** | `next.config.js` | **Partially Implemented** | Add HSTS, X-Frame-Options, X-Content-Type-Options, and CSP. |
| **Rate Limiting** | `/api/*` | **Not Implemented** | Implement in-memory/sliding-window rate limiter on intake APIs. |
