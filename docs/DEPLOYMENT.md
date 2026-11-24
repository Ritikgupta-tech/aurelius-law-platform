# Production Deployment & Hosting Guide

## Environment Prerequisites

- **Node.js**: v18.17+ or v20+ / v22+
- **Database**: PostgreSQL 15+ (Hosted on Supabase or self-hosted)
- **Host Target**: Vercel, Netlify, AWS ECS, or Docker

## 1. Supabase Setup & Migrations

1. Create a project at [supabase.com](https://supabase.com).
2. Under **Project Settings -> API**, copy:
   - Project URL
   - `anon` Public API Key
   - `service_role` Secret API Key
3. Under **SQL Editor**, execute the migration file located in:
   `supabase/migrations/20261124120000_complete_law_firm_schema.sql`
4. Verify that Row Level Security (RLS) is enabled for all 25 entities.

## 2. Environment Variables Configuration

Copy `.env.example` to `.env.local` for local development or populate them in your hosting environment settings:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SITE_URL`: Canonical site URL (e.g., `https://aureliuslaw.com`)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## 3. Production Build & Verification

```bash
# Verify TypeScript strict type-checking
npm run typecheck

# Execute automated test suite
npm test

# Build production bundle
npm run build

# Start production server
npm start
```

## 4. Netlify / Vercel Zero-Config Deployment

The project includes `netlify.toml` and Next.js App Router configuration ready for one-click deployment. Connect your repository to Netlify or Vercel, attach the environment variables, and trigger the build.
