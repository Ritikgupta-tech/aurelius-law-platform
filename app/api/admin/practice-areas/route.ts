import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  return NextResponse.json({ practiceAreas: db.getAllPracticeAreas() });
}

export async function POST(request: Request) {
  try {
    const area = await request.json();
    if (!area.title || !area.slug) {
      return NextResponse.json({ error: 'Missing title or slug.' }, { status: 400 });
    }
    const saved = db.savePracticeArea(area);
    return NextResponse.json({ practiceArea: saved, message: 'Practice area saved.' });
  } catch (error) {
    console.error('Save practice area error:', error);
    return NextResponse.json({ error: 'Failed to save practice area.' }, { status: 500 });
  }
}
