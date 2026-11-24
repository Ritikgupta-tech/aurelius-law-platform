import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  return NextResponse.json({ attorneys: db.getAllAttorneys() });
}

export async function POST(request: Request) {
  try {
    const attorney = await request.json();
    if (!attorney.full_name || !attorney.slug || !attorney.email) {
      return NextResponse.json({ error: 'Missing required attorney fields.' }, { status: 400 });
    }
    const saved = db.saveAttorney(attorney);
    return NextResponse.json({ attorney: saved, message: 'Attorney profile saved.' });
  } catch (error) {
    console.error('Save attorney error:', error);
    return NextResponse.json({ error: 'Failed to save attorney profile.' }, { status: 500 });
  }
}
