# Technical Architecture & System Design — Aurelius & Co.

## Executive Summary

Aurelius & Co. is a multi-tier legal services management platform engineered to satisfy the demands of an international law firm. The system combines an editorial client-facing web application with a management platform that enforces conflict-of-interest screening, double-booking prevention, role-based access control (RBAC), and privileged document storage.

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  - Public Editorial Site (Next.js App Router, Tailwind, TypeScript)     |
|  - Interactive Intake & Conflict Check Modal                            |
|  - Multi-Step Executive Consultation Engine                             |
|  - Authenticated Client Portal (/portal)                                |
|  - Attorney Practice Chambers (/attorney)                               |
|  - Central Administrative Console (/admin)                              |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                             API & LOGIC TIER                            |
|  - Next.js Server Route Handlers (/api/enquiries, /api/consultations)   |
|  - Conflict Screening Verification Engine                               |
|  - Dynamic Double-Booking Prevention & Time Slot Allocator              |
|  - Privileged Internal Notes Isolation Layer                            |
|  - Immutable Administrative Audit Logger                                |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                            DATA PERSISTENCE                             |
|  - Production: Supabase PostgreSQL with 25 Normalized Entities          |
|  - Row Level Security (RLS) Enforced at PostgreSQL Kernel Level         |
|  - Hybrid In-Memory Relational Engine for Instant Test/Offline Validity |
|  - AES-256 Encrypted Private Storage Buckets (client-documents)         |
+-------------------------------------------------------------------------+
```

## Key Architectural Decisions

### 1. Hybrid Persistence Architecture
To guarantee that the platform runs reliably in all environments (including production Supabase, Docker staging, and local CI without mandatory live cloud credentials), data persistence utilizes a dual-mode adapter:
- **Supabase PostgreSQL Mode**: Connects when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.
- **Relational In-Memory Store**: Provides instant, zero-latency persistence with real-world seeded entities, conflict checks, and double-booking algorithms.

### 2. Conflict of Interest Engine
A foundational ethical rule in legal practice is that an attorney cannot represent adverse parties. The platform enforces this at the intake layer:
- Every inbound inquiry and consultation request is screened against active retainers, client records, and adverse party dictionaries.
- Flagged matters are held in a `conflict_check` queue requiring administrator sign-off before confidential trial briefs or proprietary trade secrets can be ingested.

### 3. Double-Booking Prevention Engine
Appointments cannot be hardcoded or optimistically confirmed without database locking:
- Available slots are computed dynamically based on the attorney's working schedule (`09:00` to `17:00`), slot duration (`60 minutes`), and exclusion of conflicting entries.
- Colliding reservation attempts are atomically rejected with a `409 Conflict` status.

### 4. Privileged Internal Notes Isolation
Internal communications, valuation estimates, and screening notes made by partners must **never** be exposed in client-facing APIs:
- Internal notes are stored in a dedicated `internal_notes` table with strict RLS policies restricting read access to `admin`, `super_admin`, and `attorney` roles.
- Public enquiry and client endpoints explicitly strip internal notes before returning payloads.
