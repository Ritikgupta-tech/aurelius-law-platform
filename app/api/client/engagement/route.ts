import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'client-usr-101';

    const letters = db.getEngagementLetters(userId);
    return NextResponse.json({ success: true, engagementLetters: letters });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { letterId, signature } = body;

    if (!letterId || !signature) {
      return NextResponse.json(
        { success: false, error: 'letterId and signature are required' },
        { status: 400 }
      );
    }

    const updated = db.signEngagementLetter(letterId, signature);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Engagement letter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, engagementLetter: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
