import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/services/supabaseService';
import { db } from '@/lib/db/database';
import { verifyUserToken, hasAllowedRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authUser = await verifyUserToken(request);
    if (authUser && !hasAllowedRole(authUser, ['admin', 'super_admin'])) {
      return NextResponse.json({ error: 'Unauthorized: Executive administration credentials required.' }, { status: 403 });
    }

    // Parallel fetch from Supabase service with memory fallback
    const [enquiries, consultations, auditLogs] = await Promise.all([
      supabaseService.getEnquiries(),
      supabaseService.getConsultations(),
      supabaseService.getAuditLogs(50),
    ]);

    const attorneys = db.getAllAttorneys();
    const practiceAreas = db.getAllPracticeAreas();
    const blogPosts = db.getAllBlogPosts();
    const caseStudies = db.getCaseStudies();
    const testimonials = db.getAllTestimonials();
    const settings = db.getSiteSettings();

    // Calculate real-time metrics
    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
    const activeConsultations = consultations.filter((c) => c.status === 'confirmed').length;
    const pendingConflictChecks = enquiries.filter((e) => e.conflict_status === 'pending' || e.conflict_status === 'flagged').length;
    const totalAttorneys = attorneys.length;
    const publishedArticles = blogPosts.filter((p) => p.is_published).length;

    return NextResponse.json({
      metrics: {
        totalEnquiries,
        newEnquiries,
        activeConsultations,
        pendingConflictChecks,
        totalAttorneys,
        publishedArticles,
      },
      enquiries,
      consultations,
      attorneys,
      practiceAreas,
      blogPosts,
      caseStudies,
      testimonials,
      auditLogs,
      settings,
    });
  } catch (error) {
    console.error('Admin overview failed:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin workspace data.' }, { status: 500 });
  }
}
