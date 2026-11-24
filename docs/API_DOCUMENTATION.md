# Aurelius & Co. — Complete API Documentation & Specification

## 1. Overview
The **Aurelius & Co. Legal Technology Platform** provides a modern RESTful API built on the Next.js App Router. All endpoints implement standardized HTTP response bodies, strict schema validation, server-side business rules, sliding-window rate limiting, and Role-Based Access Control (RBAC).

---

## 2. Global Standards

### 2.1. Base URL
- **Production:** `https://aurelius-law-platform.vercel.app/api`
- **Development:** `http://localhost:3000/api`

### 2.2. Authentication Headers
Endpoints requiring authentication accept a standard Bearer token header:
```http
Authorization: Bearer <SUPABASE_JWT_OR_SESSION_TOKEN>
```

### 2.3. Rate Limiting Headers
Public endpoints enforce a sliding-window rate limit (15 requests/minute per IP):
```http
X-RateLimit-Limit: 15
X-RateLimit-Remaining: 14
X-RateLimit-Reset: 1732470000
```
When exceeded, the server returns HTTP 429:
```json
{
  "error": "Rate limit exceeded. Please wait a moment before submitting another inquiry."
}
```

---

## 3. API Route Directory

| Route | Methods | Auth | Access Role | Description |
|---|---|---|---|---|
| `/api/enquiries` | POST, GET | Optional | Public / Staff | Submit new legal enquiry or list filtered enquiries |
| `/api/consultations` | GET, POST, PATCH | Optional | Public / Staff | Query availability, book appointments, update status |
| `/api/client/enquiries` | POST | Required | Client | Submit authenticated matter enquiry |
| `/api/client/consultations` | POST | Required | Client | Book authenticated consultation |
| `/api/client/documents` | GET, POST | Required | Client / Staff | List user documents and register encrypted uploads |
| `/api/admin/overview` | GET | Required | Admin / Staff | Real-time firm metrics and aggregate dashboard data |
| `/api/admin/notes` | GET, POST | Required | Attorney / Admin | Retrieve and record legally privileged internal notes |
| `/api/admin/status` | PATCH | Required | Attorney / Admin | Update lifecycle status of enquiries & consultations |
| `/api/admin/attorneys` | GET, POST | Required | Admin | Manage attorney roster |
| `/api/admin/practice-areas` | GET, POST | Required | Admin | Manage legal practice areas |
| `/api/admin/blog` | GET, POST | Required | Admin | Publish editorial insights and legal articles |
| `/api/admin/audit-logs` | GET | Required | Super Admin / Admin | Forensic immutable audit trail |
| `/api/admin/settings` | GET, POST | Required | Admin | Manage firm configuration and emergency settings |
| `/api/auth/config` | GET | Public | Public | Client runtime Supabase configuration |

---

## 4. Endpoint Specifications

### 4.1. Enquiries API

#### `POST /api/enquiries`
Submits a public intake enquiry, triggers ethical conflict of interest screening, persists the record, and logs an audit trail.

**Request Body:**
```json
{
  "firstName": "Genevieve",
  "lastName": "Dupond",
  "email": "g.dupond@luxuryprivate.fr",
  "phone": "+33 1 42 68 00 00",
  "practiceArea": "Cross-Border Mergers & Acquisitions",
  "preferredContactMethod": "email",
  "message": "We require comprehensive legal counsel regarding a multi-jurisdictional MBO in Geneva and Paris."
}
```

**Response (201 Created):**
```json
{
  "reference": "AUR-20261124-E82910",
  "conflictStatus": "cleared",
  "enquiry": {
    "id": "e82910-...",
    "reference": "AUR-20261124-E82910",
    "first_name": "Genevieve",
    "last_name": "Dupond",
    "email": "g.dupond@luxuryprivate.fr",
    "practice_area": "Cross-Border Mergers & Acquisitions",
    "status": "new",
    "conflict_status": "cleared",
    "created_at": "2026-11-24T12:00:00Z"
  },
  "message": "Enquiry successfully received. Our intake counsel will review your matter and conduct conflict screening."
}
```

---

### 4.2. Consultations API

#### `GET /api/consultations?date=YYYY-MM-DD&attorneyId=<id>`
Returns available hourly consultation appointment slots for a specific counsel and date.

**Response (200 OK):**
```json
{
  "date": "2026-12-15",
  "attorneyId": "att-1",
  "availableSlots": [
    "09:00 AM - 10:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "04:00 PM - 05:00 PM"
  ]
}
```

#### `POST /api/consultations`
Books a legal consultation. Enforces double-booking prevention, assigns an encrypted video chamber link for virtual appointments, persists the booking, and creates an audit record.

**Request Body:**
```json
{
  "clientName": "Alexander Sterling",
  "clientEmail": "a.sterling@meridian.com",
  "clientPhone": "+44 20 7946 0912",
  "practiceAreaId": "pa-corp",
  "attorneyId": "att-1",
  "consultationType": "online",
  "scheduledDate": "2026-12-15",
  "timeSlot": "10:00 AM - 11:00 AM",
  "timezone": "GMT (UTC+0)",
  "notes": "Preliminary review of syndicated credit facility."
}
```

**Success Response (201 Created):**
```json
{
  "reference": "CON-20261124-774A19",
  "consultation": {
    "id": "con-774a19",
    "reference": "CON-20261124-774A19",
    "client_name": "Alexander Sterling",
    "client_email": "a.sterling@meridian.com",
    "scheduled_date": "2026-12-15",
    "time_slot": "10:00 AM - 11:00 AM",
    "consultation_type": "online",
    "meeting_link": "https://chambers.aureliuslaw.com/room/con-20261124-774a19",
    "status": "confirmed"
  },
  "message": "Consultation successfully confirmed and scheduled."
}
```

**Conflict Rejection (409 Conflict):**
```json
{
  "error": "The selected date and time slot is no longer available. Please select an alternate slot."
}
```

---

### 4.3. Legally Privileged Internal Notes API

#### `GET /api/admin/notes?entityType=enquiry&entityId=<id>`
Retrieves attorney work product and internal counsel notes.
*Security Guarantee:* If called by standard client accounts or unauthenticated requests, returns `403 Forbidden`.

**Response (200 OK):**
```json
{
  "notes": [
    {
      "id": "note-1732471000",
      "entity_type": "enquiry",
      "entity_id": "enq-101",
      "author_id": "att-1",
      "author_name": "Arthur Sterling, KC",
      "content": "Conflict check cleared against Meridian Capital. High priority engagement.",
      "created_at": "2026-11-24T12:30:00Z"
    }
  ]
}
```

#### `POST /api/admin/notes`
Records a legally privileged internal case note.

**Request Body:**
```json
{
  "entityType": "enquiry",
  "entityId": "enq-101",
  "authorId": "att-1",
  "authorName": "Arthur Sterling, KC",
  "content": "Counsel conference completed. Proceeding to formal retainer draft."
}
```

---

### 4.4. Document Vault API

#### `GET /api/client/documents?userId=<id>`
Lists encrypted documents belonging to the requesting client.

**Response (200 OK):**
```json
{
  "documents": [
    {
      "id": "doc-1",
      "filename": "Master_Engagement_Agreement_2026.pdf",
      "storage_path": "vault/client-101/doc-1.pdf",
      "size_bytes": 420500,
      "category": "engagement",
      "is_confidential": true,
      "created_at": "2026-11-20T12:00:00Z"
    }
  ]
}
```

#### `POST /api/client/documents`
Registers an uploaded document in the vault and generates an expiring HMAC-signed download URL.

**Request Body:**
```json
{
  "userId": "client-101",
  "clientName": "Jonathan Reyes",
  "filename": "Shareholder_Syndicate_Addendum.pdf",
  "storagePath": "vault/client-101/Shareholder_Syndicate_Addendum.pdf",
  "contentType": "application/pdf",
  "sizeBytes": 850400,
  "category": "pleading",
  "isConfidential": true
}
```

**Response (201 Created):**
```json
{
  "document": { ... },
  "signedUrl": "https://zbhwlvusbtjsitwucayc.supabase.co/storage/v1/object/sign/client-documents/vault/client-101/Shareholder_Syndicate_Addendum.pdf?token=...",
  "message": "Document record stored in secure vault."
}
```
