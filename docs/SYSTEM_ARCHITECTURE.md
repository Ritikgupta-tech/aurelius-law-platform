# AURELIUS & CO. — SYSTEM ARCHITECTURE SPECIFICATION
**Document Version:** 1.0.0  
**Status:** Approved Technical Architecture  

---

## 1. Architectural Overview

The **Aurelius & Co. Legal Platform** is designed as a hybrid enterprise architecture that delivers sub-100ms static edge performance for public prospective clients while providing strict relational integrity, zero-conflict ethical safeguards, and Row-Level Security (RLS) for confidential legal deliberations.

```mermaid
graph TD
    subgraph Edge ["Global Edge & Client Layer (Vercel CDN)"]
        A[Next.js 13 App Router UI]
        B[Public Editorial Pages]
        C[Client Portal /portal]
        D[Attorney Chambers /attorney]
        E[Admin Console /admin]
    end

    subgraph Serverless ["Serverless API & Controller Layer (Node.js 20/22)"]
        F[API Route Handlers /api/*]
        G[Auth Middleware & JWT Gatekeeper]
        H[Conflict Screening Engine]
        I[Double-Booking Prevention Service]
        J[Privileged Notes Isolation Barrier]
        K[Audit Log Emitter]
    end

    subgraph Storage ["Persistence & Data Layer (Supabase / AWS ap-southeast-1)"]
        L[(PostgreSQL 15 Relational DB)]
        M[Supabase Auth Engine]
        N[Private Document Vault Bucket]
        O[In-Memory Resilient Cache]
    end

    A --> B & C & D & E
    C & D & E --> F
    F --> G
    G --> H & I & J & K
    H & I & J & K --> L
    G --> M
    F --> N
    L -.->|Fallback / Seed Sync| O
```

---

## 2. Core Architectural Layers

### A. Presentation & Client Layer (Next.js 13 App Router)
- **Framework:** Next.js 13.5.1 with Server Components for SEO and Client Components (`'use client'`) for interactive legal tools.
- **Styling Architecture:** Tailwind CSS with semantic legal tokens (`--navy`, `--gold`, `--ivory`, `--line-gold`).
- **State Management:** Reactive React hooks with optimistic UI updates and real-time backend synchronization.
- **Sensory & Telemetry:** Web Audio API haptic tone feedback, scroll progress telemetry, and responsive floating HUD.

### B. Controller & Business Logic Layer
- **Route Handlers:** Next.js 13 App Router `/api/*` handlers with standardized JSON responses:
  ```typescript
  // Standard Success Contract
  { ok: true, data: T, message?: string }
  
  // Standard Error Contract
  { error: string, code?: string, details?: any }
  ```
- **Validation Engine:** Strict server-side type and regex sanitation enforcing name lengths, email syntaxes, and date formats before database interaction.
- **Service Layer (`lib/services/`):** Clean separation between HTTP route handlers and database mutations.

### C. Authentication & Access Control Layer (RBAC)
- **Identity Provider:** Supabase Auth with secure JWT tokens.
- **Role Hierarchy:**
  - `super_admin`: Total system authority, audit inspection, and attorney credential certification.
  - `admin`: Operational practice management, conflict review, and consultation oversight.
  - `attorney`: Designated counsel access to assigned matters, consultation video rooms, and privileged internal notes.
  - `client`: Individual matter tracking, personal consultation history, and encrypted document access.
  - `anonymous`: Public editorial reading and non-confidential intake submission.

### D. Persistence & Storage Layer
- **Primary Database:** Managed Supabase PostgreSQL with 25 normalized relational entities.
- **Row-Level Security (RLS):** Declarative SQL policies enforcing tenant isolation directly at the database engine.
- **Object Storage:** Private Supabase Storage bucket (`client-documents`) served via short-lived signed URLs (15-minute expiration), strictly forbidding direct public bucket reads.
- **Resilient Memory Cache:** In-memory relational store operating as a zero-latency fallback and test runner substrate.
