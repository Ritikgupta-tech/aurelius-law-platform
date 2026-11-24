import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, practiceArea, message, preferredContactMethod, userId } = body;

    if (!firstName || !lastName || !email || !practiceArea || !message) {
      return NextResponse.json({ error: 'Please complete every required field.' }, { status: 400 });
    }

    const cleanFirst = String(firstName).trim();
    const cleanLast = String(lastName).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPractice = String(practiceArea).trim();
    const cleanMessage = String(message).trim();

    if (cleanFirst.length < 1 || cleanLast.length < 1 || !cleanEmail.includes('@') || cleanMessage.length < 10) {
      return NextResponse.json({ error: 'Please enter valid enquiry details.' }, { status: 400 });
    }

    const enquiry = db.createEnquiry({
      first_name: cleanFirst,
      last_name: cleanLast,
      email: cleanEmail,
      phone: phone ? String(phone).trim() : undefined,
      practice_area: cleanPractice,
      preferred_contact_method: preferredContactMethod || 'email',
      message: cleanMessage,
      user_id: userId || null,
    });

    return NextResponse.json({
      reference: enquiry.reference,
      conflictStatus: enquiry.conflict_status,
      message: 'Enquiry successfully received. Our intake counsel will review your matter and conduct conflict screening.',
    }, { status: 201 });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json({ error: 'We could not submit your enquiry. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const userEnquiries = db.getEnquiriesByUserId(userId);
      return NextResponse.json({ enquiries: userEnquiries });
    }

    const allEnquiries = db.getEnquiries();
    return NextResponse.json({ enquiries: allEnquiries });
  } catch (error) {
    console.error('Enquiry retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve enquiries.' }, { status: 500 });
  }
}
