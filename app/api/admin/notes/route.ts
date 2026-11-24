import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/services/supabaseService';
import { verifyUserToken, hasAllowedRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authUser = await verifyUserToken(request);
    // If authenticated as client, reject with 403 Forbidden
    if (authUser && !hasAllowedRole(authUser, ['admin', 'super_admin', 'attorney'])) {
      return NextResponse.json(
        { error: 'Access forbidden: Internal notes are privileged and restricted from clients.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType') as 'enquiry' | 'consultation' | 'client';
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Missing entityType or entityId query params.' }, { status: 400 });
    }

    const notes = await supabaseService.getInternalNotes(entityType, entityId);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Internal notes GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve internal notes.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await verifyUserToken(request);
    if (authUser && !hasAllowedRole(authUser, ['admin', 'super_admin', 'attorney'])) {
      return NextResponse.json(
        { error: 'Access forbidden: Internal notes can only be authored by counsel or administrators.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { entityType, entityId, authorId, authorName, content } = body;

    if (!entityType || !entityId || !content) {
      return NextResponse.json({ error: 'Please enter note content and valid entity identifiers.' }, { status: 400 });
    }

    const effectiveAuthorId = authUser?.id || authorId || 'admin-usr';
    const effectiveAuthorName = authUser?.displayName || authorName || 'Senior Legal Counsel';

    const note = await supabaseService.addInternalNote({
      entity_type: entityType,
      entity_id: entityId,
      author_id: effectiveAuthorId,
      author_name: effectiveAuthorName,
      content: String(content).trim(),
    });

    return NextResponse.json({ note, message: 'Privileged note recorded and persisted.' }, { status: 201 });
  } catch (error) {
    console.error('Internal notes POST error:', error);
    return NextResponse.json({ error: 'Failed to save privileged internal note.' }, { status: 500 });
  }
}
