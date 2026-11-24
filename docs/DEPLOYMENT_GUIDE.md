# Aurelius & Co. — Production Deployment Guide

## 1. Prerequisites
- **Node.js:** v20.x LTS or higher
- **Package Manager:** npm v10.x with legacy peer dependencies enabled (`.npmrc`)
- **Vercel Account:** Linked to repository `Ritikgupta-tech/aurelius-law-platform`
- **Supabase Account:** Project `zbhwlvusbtjsitwucayc` (`aurelius-law-platform`)

---

## 2. Database Setup (Supabase PostgreSQL)

1. Open the Supabase Dashboard: [https://supabase.com/dashboard/project/zbhwlvusbtjsitwucayc](https://supabase.com/dashboard/project/zbhwlvusbtjsitwucayc)
2. Navigate to **SQL Editor**.
3. Load the idempotent master schema located in:
   `supabase/migrations/20261124120000_complete_law_firm_schema.sql`
4. Click **Run**.
5. Verify output: `Success. No rows returned.`
6. Verify under **Table Editor** that all 25 tables are present (`profiles`, `practice_areas`, `attorneys`, `enquiries`, `consultations`, `internal_notes`, `documents`, `audit_logs`, etc.).
7. Verify under **Storage** that bucket `client-documents` is created and set to private.

---

## 3. Environment Variables Configuration

Configure the following variables in Vercel (**Settings** -> **Environment Variables**):

| Variable Name | Environment | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production, Preview | `https://aurelius-law-platform.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | `https://zbhwlvusbtjsitwucayc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | `sb_publishable_dKXS84lH_eBADQsNVtw_GA_7vhbvx8i` |
| `SUPABASE_URL` | Production, Preview | `https://zbhwlvusbtjsitwucayc.supabase.co` |
| `SUPABASE_ANON_KEY` | Production, Preview | `sb_publishable_dKXS84lH_eBADQsNVtw_GA_7vhbvx8i` |
| `SUPPORT_EMAIL` | Production, Preview | `inquiries@aureliuslaw.com` |

---

## 4. Local Build & Verification

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suites
npm test

# 3. Validate TypeScript compilation
npm run typecheck

# 4. Generate local production build
npm run build
```

---

## 5. Deployment via Vercel CLI

```bash
# 1. Link project
npx vercel link --project aurelius-law-platform --yes

# 2. Deploy to Production
npx vercel deploy --prod --yes
```

Upon completion, Vercel deploys the application and binds it to the canonical production domain:
`https://aurelius-law-platform.vercel.app`
