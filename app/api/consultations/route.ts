import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/services/supabaseService';
import { ConsultationType, ConsultationStatus } from '@/lib/db/types';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const attorneyId = searchParams.get('attorneyId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    // If querying available slots for booking
    if (date) {
      const slots = await supabaseService.getAvailableSlots(attorneyId || null, date);
      return NextResponse.json({ date, attorneyId, availableSlots: slots });
    }

    const consultations = await supabaseService.getConsultations({
      userId: userId || undefined,
      attorneyId: attorneyId || undefined,
      status: status || undefined,
    });

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error('Consultation GET error:', error);
    return NextResponse.json({ error: 'Failed to load consultations.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`consultation_${ip}`, 15, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before booking another appointment.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await request.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      practiceAreaId,
      attorneyId,
      consultationType,
      scheduledDate,
      timeSlot,
      timezone,
      notes,
      userId,
    } = body;

    if (!clientName || !clientEmail || !practiceAreaId || !scheduledDate || !timeSlot) {
      return NextResponse.json({ error: 'Please complete all required consultation booking fields.' }, { status: 400 });
    }

    const bookingResult = await supabaseService.bookConsultation({
      client_name: String(clientName).trim(),
      client_email: String(clientEmail).trim().toLowerCase(),
      client_phone: clientPhone ? String(clientPhone).trim() : undefined,
      practice_area_id: String(practiceAreaId).trim(),
      attorney_id: attorneyId ? String(attorneyId).trim() : null,
      consultation_type: (consultationType as ConsultationType) || 'online',
      scheduled_date: String(scheduledDate).trim(),
      time_slot: String(timeSlot).trim(),
      timezone: String(timezone || 'GMT (UTC+0)').trim(),
      notes: notes ? String(notes).trim() : undefined,
      user_id: userId || null,
    });

    if (bookingResult.error || !bookingResult.consultation) {
      return NextResponse.json({ error: bookingResult.error || 'Failed to book consultation.' }, { status: 409 });
    }

    return NextResponse.json({
      consultation: bookingResult.consultation,
      reference: bookingResult.consultation.reference,
      message: 'Consultation successfully confirmed and scheduled.',
    }, { status: 201 });
  } catch (error) {
    console.error('Consultation booking error:', error);
    return NextResponse.json({ error: 'Failed to schedule consultation.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, performedBy } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing consultation ID or status.' }, { status: 400 });
    }

    const actor = performedBy || { id: 'admin', name: 'Managing Partner / Staff', role: 'admin' };
    const success = await supabaseService.updateConsultationStatus(id, status as ConsultationStatus, actor);

    if (!success) {
      return NextResponse.json({ error: 'Consultation not found or update failed.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: `Status updated to ${status}` });
  } catch (error) {
    console.error('Consultation patch error:', error);
    return NextResponse.json({ error: 'Failed to update consultation.' }, { status: 500 });
  }
}
