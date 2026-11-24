import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { table, id, status, performedBy, attorneyId } = body;

    if (!table || !id) {
      return NextResponse.json({ error: 'Missing required update parameters.' }, { status: 400 });
    }

    const actor = performedBy || { id: 'admin-1', name: 'Executive Administrator', role: 'admin' };

    if (table === 'enquiries') {
      if (attorneyId !== undefined) {
        db.assignEnquiryAttorney(id, attorneyId, actor);
      }
      if (status) {
        db.updateEnquiryStatus(id, status, actor);
      }
      return NextResponse.json({ ok: true, message: 'Enquiry updated successfully.' });
    }

    if (table === 'consultations') {
      if (status) {
        db.updateConsultationStatus(id, status, actor);
      }
      return NextResponse.json({ ok: true, message: 'Consultation updated successfully.' });
    }

    if (table === 'testimonials') {
      const isApproved = status === 'approved' || status === true;
      db.updateTestimonialApproval(id, isApproved);
      return NextResponse.json({ ok: true, message: 'Testimonial status updated.' });
    }

    return NextResponse.json({ error: 'Unsupported table for status update.' }, { status: 400 });
  } catch (error) {
    console.error('Admin status update error:', error);
    return NextResponse.json({ error: 'Failed to execute status update.' }, { status: 500 });
  }
}
