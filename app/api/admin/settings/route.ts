export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  return NextResponse.json({ settings: db.getSiteSettings() });
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const updated = db.updateSiteSettings(updates);
    return NextResponse.json({ settings: updated, message: 'Firm settings updated.' });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
