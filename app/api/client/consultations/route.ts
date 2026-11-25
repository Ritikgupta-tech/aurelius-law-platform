export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type ConsultationPayload = { practiceArea?: unknown; consultationType?: unknown; preferredDate?: unknown; preferredTime?: unknown; timezone?: unknown; message?: unknown };
const isText = (value: unknown): value is string => typeof value === 'string';
type ValidConsultationPayload = { practiceArea: string; consultationType: string; preferredDate: string; preferredTime: string; timezone: string; message: string };
const isValidPayload = (body: ConsultationPayload): body is ValidConsultationPayload =>
  [body.practiceArea, body.consultationType, body.preferredDate, body.preferredTime, body.timezone, body.message].every(isText);

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
    const body = (await request.json()) as ConsultationPayload;
    if (!token || !isValidPayload(body)) return NextResponse.json({ error: 'Please sign in and complete every required field.' }, { status: 400 });

    const authClient = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_ANON_KEY as string, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });

    const practiceArea = body.practiceArea.trim();
    const consultationType = body.consultationType.trim();
    const preferredDate = body.preferredDate.trim();
    const preferredTime = body.preferredTime.trim();
    const timezone = body.timezone.trim();
    const message = body.message.trim();
    if (!['online', 'in_person', 'phone'].includes(consultationType) || practiceArea.length < 1 || practiceArea.length > 120 || preferredDate.length !== 10 || preferredTime.length < 1 || preferredTime.length > 80 || timezone.length < 1 || timezone.length > 80 || message.length < 10 || message.length > 4000) return NextResponse.json({ error: 'Please check the consultation details and try again.' }, { status: 400 });

    const reference = `CON-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase()}`;
    const adminClient = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await adminClient.from('consultations').insert({ reference, user_id: userData.user.id, practice_area: practiceArea, consultation_type: consultationType, preferred_date: preferredDate, preferred_time: preferredTime, timezone, message });
    if (error) { console.error('consultation request failed', error); return NextResponse.json({ error: 'We could not request your consultation. Please try again.' }, { status: 500 }); }
    return NextResponse.json({ reference }, { status: 201 });
  } catch (error) {
    console.error('consultation request failed', error);
    return NextResponse.json({ error: 'We could not request your consultation. Please try again.' }, { status: 500 });
  }
}
