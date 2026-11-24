# Quality Assurance & Testing Suite

## Testing Strategy

The platform maintains a comprehensive automated testing suite built with **Vitest** that verifies core business logic, ethical conflict screening, double-booking prevention algorithms, and lifecycle status transitions.

## Running Tests

Execute the automated test suite locally:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npx vitest

# Run TypeScript type verification
npm run typecheck
```

## Test Coverage Summary

### Test File 1: `test/database.test.ts` (11 Tests)
1. **Catalog Integrity**: Verifies 15 practice areas and 6 premier attorneys are loaded.
2. **Conflict Clearance**: Confirms benign inquiries are cleared with affirmative compliance notes.
3. **Conflict Flagging**: Confirms hostile / adverse party keywords are flagged for manual compliance review.
4. **Availability Verification**: Checks slot availability logic against the calendar.
5. **Consultation Reservation**: Books appointment, asserts unique `CON-YYYYMMDD-XXXXXX` schema format.
6. **Double-Booking Collision**: Confirms subsequent reservation on the same attorney and time slot is rejected.
7. **Dynamic Slot Exclusion**: Confirms booked slots are excluded from future availability queries.
8. **Enquiry Reference Formatting**: Confirms `AUR-YYYYMMDD-XXXXXX` format.
9. **Lifecycle Status Transitions**: Tests `new` -> `under_review` -> `conflict_check` -> `converted`.
10. **Privileged Note Segregation**: Verifies internal lawyer notes are isolated per entity.
11. **Audit Trail Logging**: Verifies immutable logs are recorded with timestamp and actor details.

### Test File 2: `test/workflows.test.ts` (14 Tests)
1. **Public Content Schema Completeness**: Confirms all 15 practices have required service arrays and typical matters.
2. **Dynamic Slug Resolution**: Verifies route slug lookups across practice areas.
3. **Attorney Credentials Integrity**: Tests bar admissions and university education fields.
4. **Case Studies Structure**: Validates anonymized titles, challenges, strategies, and outcomes.
5. **Blog Article Metadata**: Tests categories, reading times, and tag arrays.
6. **Conflict Screening Nuances**: Asserts party matching algorithms.
7. **Multi-Stage Intake Verification**: Tests intake validation.
8. **Lead Attorney Assignment**: Verifies matter reassignment updates the record.
9. **Concurrent Booking Protection**: Tests concurrent booking collision prevention.
10. **Calendar Invitation Generation**: Verifies encrypted video meeting link generation.
11. **Entity-Specific Notes Isolation**: Proves matter A cannot access matter B's internal notes.
12. **Administrative Action Auditing**: Tests audit log chronologies.
13. **Data Sanitization**: Tests input length bounds.
14. **Role Boundary Enforcement**: Tests RBAC permissions matrix.
