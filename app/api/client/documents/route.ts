import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/services/supabaseService';
import { verifyUserToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authUser = await verifyUserToken(request);
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    // Scope documents to the authenticated client unless administrator
    let targetUserId = requestedUserId;
    if (authUser && authUser.role === 'client') {
      targetUserId = authUser.id;
    }

    const documents = await supabaseService.getDocuments(targetUserId || undefined);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Client documents GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve client documents.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await verifyUserToken(request);
    const body = await request.json();
    const {
      userId,
      clientName,
      filename,
      storagePath,
      contentType,
      sizeBytes,
      category,
      isConfidential,
    } = body;

    if (!filename || !storagePath) {
      return NextResponse.json({ error: 'Missing document metadata or storage reference.' }, { status: 400 });
    }

    const effectiveUserId = authUser?.id || userId || 'client-guest';
    const effectiveClientName = authUser?.displayName || clientName || 'Client';

    const documentRecord = await supabaseService.createDocumentRecord({
      user_id: effectiveUserId,
      client_name: effectiveClientName,
      filename: String(filename),
      storage_path: String(storagePath),
      content_type: String(contentType || 'application/pdf'),
      size_bytes: Number(sizeBytes) || 0,
      category: category || 'evidence',
      is_confidential: isConfidential ?? true,
      uploaded_by_id: effectiveUserId,
      uploaded_by_name: effectiveClientName,
    });

    const signedUrl = await supabaseService.getSignedDownloadUrl(documentRecord.storage_path);

    return NextResponse.json({
      document: documentRecord,
      signedUrl,
      message: 'Document record stored in secure vault.',
    }, { status: 201 });
  } catch (error) {
    console.error('Client documents POST error:', error);
    return NextResponse.json({ error: 'Failed to register document in vault.' }, { status: 500 });
  }
}
