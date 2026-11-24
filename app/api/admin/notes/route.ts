import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType') as 'enquiry' | 'consultation' | 'client';
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Missing entityType or entityId query params.' }, { status: 400 });
    }

    const notes = db.getInternalNotes(entityType, entityId);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Internal notes GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve internal notes.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entityType, entityId, authorId, authorName, content } = body;

    if (!entityType || !entityId || !content) {
      return NextResponse.json({ error: 'Please enter note content and valid entity identifiers.' }, { status: 400 });
    }

    const note = db.addInternalNote({
      entity_type: entityType,
      entity_id: entityId,
      author_id: authorId || 'admin-usr',
      author_name: authorName || 'Senior Legal Counsel',
      content: String(content).trim(),
    });

    return NextResponse.json({ note, message: 'Privileged note recorded.' }, { status: 201 });
  } catch (error) {
    console.error('Internal notes POST error:', error);
    return NextResponse.json({ error: 'Failed to save privileged internal note.' }, { status: 500 });
  }
}
