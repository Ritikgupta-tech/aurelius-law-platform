import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function adminClient() {
  return createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_ANON_KEY as string, { auth: { persistSession: false, autoRefreshToken: false } });
}

function serviceClient() {
  return createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function requireAdmin(authorization: string | null) {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return null;
  const { data: userData, error } = await adminClient().auth.getUser(token);
  if (error || !userData.user) return null;
  const { data: profile } = await serviceClient().from('profiles').select('role').eq('id', userData.user.id).maybeSingle();
  if (profile?.role !== 'admin') return null;
  return userData.user;
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin(request.headers.get('authorization'));
    if (!user) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

    const body = (await request.json()) as { storagePath?: string };
    if (!body.storagePath) return NextResponse.json({ error: 'Missing document path.' }, { status: 400 });

    const { data, error: signError } = await serviceClient().storage.from('client-documents').createSignedUrl(body.storagePath, 120);
    if (signError || !data?.signedUrl) { console.error('admin signed url failed', signError); return NextResponse.json({ error: 'We could not generate a download link.' }, { status: 500 }); }
    return NextResponse.json({ url: data.signedUrl });
  } catch (error) {
    console.error('admin download failed', error);
    return NextResponse.json({ error: 'We could not generate a download link.' }, { status: 500 });
  }
}
