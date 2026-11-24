import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  return NextResponse.json({ blogPosts: db.getAllBlogPosts() });
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    if (!post.title || !post.slug || !post.content) {
      return NextResponse.json({ error: 'Missing required article fields.' }, { status: 400 });
    }
    const saved = db.saveBlogPost(post);
    return NextResponse.json({ blogPost: saved, message: 'Article published/saved.' });
  } catch (error) {
    console.error('Save blog error:', error);
    return NextResponse.json({ error: 'Failed to save blog post.' }, { status: 500 });
  }
}
