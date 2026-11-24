import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { ConsultationType } from '@/lib/db/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const attorneyId = searchParams.get('attorneyId');
    const userId = searchParams.get('userId');

    // If querying available slots for booking
    if (date) {
      const slots = db.getAvailableSlots(attorneyId || null, date);
      return NextResponse.json({ date, attorneyId, availableSlots: slots });
    }

    if (userId) {
      const userConsultations = db.getConsultationsByUserId(userId);
      return NextResponse.json({ consultations: userConsultations });
    }

    const all = db.getConsultations();
    return NextResponse.json({ consultations: all });
  } catch (error) {
    console.error('Consultation GET error:', error);
    return NextResponse.json({ error: 'Failed to load consultations.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const bookingResult = db.bookConsultation({
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
    const success = db.updateConsultationStatus(id, status, actor);

    if (!success) {
      return NextResponse.json({ error: 'Consultation not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: `Status updated to ${status}` });
  } catch (error) {
    console.error('Consultation patch error:', error);
    return NextResponse.json({ error: 'Failed to update consultation.' }, { status: 500 });
  }
}
