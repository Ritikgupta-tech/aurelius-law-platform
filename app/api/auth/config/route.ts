import { NextResponse } from 'next/server';

export function GET() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Authentication is unavailable right now.' }, { status: 503 });
  }

  return NextResponse.json({ url, anonKey }, { headers: { 'Cache-Control': 'no-store' } });
}
