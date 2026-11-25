export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type ClientEnquiryPayload = { practiceArea?: unknown; message?: unknown };
const isText = (value: unknown): value is string => typeof value === 'string';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
    const body = (await request.json()) as ClientEnquiryPayload;

    if (!token || !isText(body.practiceArea) || !isText(body.message)) {
      return NextResponse.json({ error: 'Please sign in and complete the required fields.' }, { status: 400 });
    }

    const authClient = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_ANON_KEY as string, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });

    const practiceArea = body.practiceArea.trim();
    const message = body.message.trim();
    if (practiceArea.length < 1 || practiceArea.length > 120 || message.length < 10 || message.length > 4000) {
      return NextResponse.json({ error: 'Please check the enquiry details and try again.' }, { status: 400 });
    }

    const reference = `AUR-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase()}`;
    const adminClient = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: profile } = await adminClient.from('profiles').select('display_name').eq('id', userData.user.id).maybeSingle();
    const displayName = typeof profile?.display_name === 'string' ? profile.display_name.trim().split(' ') : [];
    const firstName = displayName[0] || 'Client';
    const lastName = displayName.slice(1).join(' ') || 'Account';
    const { error } = await adminClient.from('enquiries').insert({ reference, user_id: userData.user.id, first_name: firstName, last_name: lastName, email: userData.user.email ?? '', practice_area: practiceArea, message });

    if (error) {
      console.error('client enquiry submission failed', error);
      return NextResponse.json({ error: 'We could not submit your enquiry. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ reference }, { status: 201 });
  } catch (error) {
    console.error('client enquiry request failed', error);
    return NextResponse.json({ error: 'We could not submit your enquiry. Please try again.' }, { status: 500 });
  }
}
