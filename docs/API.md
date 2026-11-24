# API Reference & Endpoint Specifications

## Public Endpoints

### 1. Inquiries Intake
- **`POST /api/enquiries`**
  - **Description**: Submits a new non-confidential legal matter inquiry. Automatically triggers the conflict screening engine.
  - **Request Body**:
    ```json
    {
      "firstName": "Alexander",
      "lastName": "Wright",
      "email": "a.wright@wrightmarine.co.uk",
      "phone": "+44 7700 900123",
      "practiceArea": "Corporate & Commercial Law",
      "preferredContactMethod": "email",
      "message": "Assistance required with management buyout facility."
    }
    ```
  - **Success Response (201 Created)**:
    ```json
    {
      "reference": "AUR-20261124-7F89B2",
      "conflictStatus": "cleared",
      "message": "Enquiry successfully received..."
    }
    ```

### 2. Consultation Scheduling
- **`GET /api/consultations?date=YYYY-MM-DD&attorneyId=att-1`**
  - **Description**: Returns dynamic list of open, uncollided time slots for the chosen attorney and date.
- **`POST /api/consultations`**
  - **Description**: Reserves a dedicated consultation session with double-booking prevention.
  - **Request Body**:
    ```json
    {
      "clientName": "Jonathan Reyes",
      "clientEmail": "j.reyes@meridian.com",
      "clientPhone": "+44 20 7946 0912",
      "practiceAreaId": "pa-corp",
      "attorneyId": "att-1",
      "consultationType": "online",
      "scheduledDate": "2026-11-28",
      "timeSlot": "10:00 AM - 11:00 AM",
      "timezone": "GMT (London, UTC+0)",
      "notes": "Initial discussion regarding buyout covenants."
    }
    ```
  - **Success Response (201 Created)**:
    ```json
    {
      "reference": "CON-20261124-44BC12",
      "consultation": { ... },
      "message": "Consultation successfully confirmed and scheduled."
    }
    ```
  - **Error Response (409 Conflict)**:
    ```json
    {
      "error": "The selected date and time slot is no longer available. Please select an alternate slot."
    }
    ```

## Administrative Endpoints (`/api/admin/*`)

### 3. Central Overview
- **`GET /api/admin/overview`**: Returns aggregated real-time database counts, enquiries list, consultations list, attorney roster, and audit trail.

### 4. Status Transition
- **`PATCH /api/admin/status`**: Updates the workflow state of an inquiry (`new`, `under_review`, `conflict_check`, `converted`, `closed`) or consultation (`confirmed`, `cancelled`, `completed`).

### 5. Privileged Internal Notes
- **`GET /api/admin/notes?entityType=enquiry&entityId=...`**: Fetches privileged notes attached to a matter.
- **`POST /api/admin/notes`**: Records a new privileged note with attorney author attribution.
