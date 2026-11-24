import { describe, it, expect } from 'vitest';
import { db } from '../lib/db/database';
import { supabaseService } from '../lib/services/supabaseService';

describe('Concurrency & Scheduling Guarantees', () => {
  const targetDate = '2026-12-20';
  const targetSlot = '02:00 PM - 03:00 PM';
  const targetAttorney = 'att-2';

  it('prevents double-booking when two clients book the exact same slot concurrently', async () => {
    // Client A and Client B concurrently submit booking requests
    const bookingPromiseA = supabaseService.bookConsultation({
      client_name: 'Client Alpha Ltd',
      client_email: 'alpha@enterprise.co.uk',
      practice_area_id: 'pa-banking',
      attorney_id: targetAttorney,
      consultation_type: 'online',
      scheduled_date: targetDate,
      time_slot: targetSlot,
      timezone: 'GMT (UTC+0)',
      notes: 'Urgent syndicate review.',
    });

    const bookingPromiseB = supabaseService.bookConsultation({
      client_name: 'Client Beta Holdings',
      client_email: 'beta@holdings.co.uk',
      practice_area_id: 'pa-banking',
      attorney_id: targetAttorney,
      consultation_type: 'online',
      scheduled_date: targetDate,
      time_slot: targetSlot,
      timezone: 'GMT (UTC+0)',
      notes: 'Overlapping transaction review.',
    });

    const [resultA, resultB] = await Promise.all([bookingPromiseA, bookingPromiseB]);

    // Exactly one booking must succeed, and one must be rejected
    const successCount = (resultA.consultation ? 1 : 0) + (resultB.consultation ? 1 : 0);
    const failureCount = (resultA.error ? 1 : 0) + (resultB.error ? 1 : 0);

    expect(successCount).toBe(1);
    expect(failureCount).toBe(1);

    const failedResult = resultA.error ? resultA : resultB;
    expect(failedResult.error).toMatch(/available|reserved/);
  });

  it('removes reserved slots from available slots calculation', async () => {
    const slots = await supabaseService.getAvailableSlots(targetAttorney, targetDate);
    expect(slots).not.toContain(targetSlot);
  });

  it('permits booking of a distinct slot on the same date for the same attorney', async () => {
    const alternateSlot = '03:00 PM - 04:00 PM';
    const result = await supabaseService.bookConsultation({
      client_name: 'Client Gamma Corp',
      client_email: 'gamma@corp.com',
      practice_area_id: 'pa-banking',
      attorney_id: targetAttorney,
      consultation_type: 'in_person',
      scheduled_date: targetDate,
      time_slot: alternateSlot,
      timezone: 'GMT (UTC+0)',
    });

    expect(result.consultation).toBeDefined();
    expect(result.consultation?.time_slot).toBe(alternateSlot);
  });
});
