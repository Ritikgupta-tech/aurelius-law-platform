import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  try {
    const enquiries = db.getEnquiries();
    const consultations = db.getConsultations();
    const attorneys = db.getAllAttorneys();
    const practiceAreas = db.getAllPracticeAreas();
    const blogPosts = db.getAllBlogPosts();
    const caseStudies = db.getCaseStudies();
    const testimonials = db.getAllTestimonials();
    const auditLogs = db.getAuditLogs().slice(0, 50);
    const settings = db.getSiteSettings();

    // Derived real metrics
    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
    const activeConsultations = consultations.filter((c) => c.status === 'confirmed').length;
    const pendingConflictChecks = enquiries.filter((e) => e.conflict_status === 'pending').length;
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
