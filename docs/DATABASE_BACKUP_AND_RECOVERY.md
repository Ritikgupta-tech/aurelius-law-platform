# Aurelius & Co. — Database Backup and Recovery Strategy

## 1. Overview
Client confidentiality, regulatory compliance, and business continuity require a resilient disaster recovery strategy for the **Aurelius & Co. Legal Technology Platform**.

---

## 2. Backup Architecture

### 2.1. Automated Daily Snapshots
- Managed directly by Supabase PostgreSQL infrastructure.
- Snapshots retained according to the retention window.
- Backups include:
  - All 25 relational tables
  - Foreign key constraints, unique constraints, and indexes
  - Triggers and functions (`on_auth_user_created`, `promote_to_admin`)
  - Row Level Security (RLS) policies

### 2.2. Point-in-Time Recovery (PITR)
- Supabase PITR continuously archives PostgreSQL Write-Ahead Logs (WAL).
- Enables restoration to any specific second in the event of accidental data corruption or malicious drop.

### 2.3. Offline Disaster Recovery Dump
In addition to cloud-managed backups, an administrative SQL dump can be taken via `pg_dump`:
```bash
# Export schema and data
pg_dump -h db.zbhwlvusbtjsitwucayc.supabase.co -U postgres -d postgres -F c -b -v -f aurelius_backup_$(date +%Y%m%d).dump
```

---

## 3. Disaster Recovery Runbook

### Scenario: Database State Corruption or Dropped Table
1. **Isolate System:** Temporarily redirect incoming traffic to maintenance mode via Vercel Edge Middleware.
2. **Determine Point of Failure:** Inspect `audit_logs` table to establish the exact timestamp of corruption:
   ```sql
   SELECT created_at, action, user_email, details 
   FROM public.audit_logs 
   ORDER BY created_at DESC LIMIT 20;
   ```
3. **Initiate PITR Restoration:**
   - In Supabase Dashboard, select **Database** -> **Backups** -> **Point in Time**.
   - Select the target timestamp 1 minute prior to the incident.
   - Execute restore.
4. **Re-apply Master Schema & Integrity Check:**
   - Run verification query:
     ```sql
     SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
     ```
   - Ensure all 25 tables, triggers, and RLS policies are operational.
5. **Re-enable Production Traffic:** Remove maintenance redirect and verify end-to-end functionality.
