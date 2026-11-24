import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/services/supabaseService';
import { db } from '@/lib/db/database';
import { verifyUserToken, hasAllowedRole } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const authUser = await verifyUserToken(request);
    if (authUser && !hasAllowedRole(authUser, ['admin', 'super_admin', 'attorney'])) {
      return NextResponse.json({ error: 'Unauthorized: Administrative or legal counsel privileges required.' }, { status: 403 });
    }

    const body = await request.json();
    const { table, id, status, performedBy, attorneyId } = body;

    if (!table || !id) {
      return NextResponse.json({ error: 'Missing required update parameters.' }, { status: 400 });
    }

    const actor = performedBy || {
      id: authUser?.id || 'admin-1',
      name: authUser?.displayName || 'Executive Administrator',
      role: authUser?.role || 'admin',
    };

    if (table === 'enquiries') {
      const success = await supabaseService.updateEnquiryStatus(id, status, actor, attorneyId);
      return NextResponse.json({ ok: success, message: 'Enquiry updated successfully in database.' });
    }

    if (table === 'consultations') {
      const success = await supabaseService.updateConsultationStatus(id, status, actor);
      return NextResponse.json({ ok: success, message: 'Consultation updated successfully in database.' });
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
