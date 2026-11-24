# Aurelius & Co. — Environment Variables Reference

## 1. Overview
This document specifies all environment variables required by the **Aurelius & Co. Legal Technology Platform** across local development, CI/CD pipelines, preview environments, and production deployment on Vercel.

---

## 2. Variables Catalog

### 2.1. Client-Side Variables (`NEXT_PUBLIC_*`)
Exposed to the browser client runtime for routing, API dispatch, and Supabase client initialization.

| Variable Name | Required | Default / Production Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://aurelius-law-platform.vercel.app` | Canonical public site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `https://zbhwlvusbtjsitwucayc.supabase.co` | Supabase API Gateway endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `sb_publishable_dKXS84lH_eBADQsNVtw_GA_7vhbvx8i` | Supabase Anonymous Client Public Key |

### 2.2. Server-Side Variables (Secure)
Never exposed to the client bundle. Accessible only inside Next.js serverless functions and route handlers.

| Variable Name | Required | Default / Production Value | Description |
|---|---|---|---|
| `SUPABASE_URL` | Yes | `https://zbhwlvusbtjsitwucayc.supabase.co` | Backend Supabase endpoint |
| `SUPABASE_ANON_KEY` | Yes | `sb_publishable_dKXS84lH_eBADQsNVtw_GA_7vhbvx8i` | Supabase Anonymous Key for auth verification |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | *(Configured via Supabase console)* | Elevated service-role key for administrative RPCs |
| `SUPPORT_EMAIL` | Yes | `inquiries@aureliuslaw.com` | Firm intake and notifications recipient |
| `NODE_ENV` | Yes | `production` / `development` | Node.js execution environment |

---

## 3. Local Development Template (`.env.local`)

```bash
# -----------------------------------------------------------------------------
# AURELIUS & CO. — ENVIRONMENT CONFIGURATION
# -----------------------------------------------------------------------------

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"

# Connected Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL="https://zbhwlvusbtjsitwucayc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_dKXS84lH_eBADQsNVtw_GA_7vhbvx8i"
SUPABASE_URL="https://zbhwlvusbtjsitwucayc.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_dKXS84lH_eBADQsNVtw_GA_7vhbvx8i"

# Support & Mail
SUPPORT_EMAIL="inquiries@aureliuslaw.com"
```
