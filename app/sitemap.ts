import { MetadataRoute } from 'next';
import { db } from '@/lib/db/database';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aurelius-law-platform.vercel.app';
  const now = new Date();

  // Core static pages
  const staticRoutes = [
    '',
    '/about',
    '/practice-areas',
    '/attorneys',
    '/case-studies',
    '/insights',
    '/book-consultation',
    '/portal',
    '/contact',
    '/faq',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/cookie-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic practice areas
  const practiceAreas = db.getPracticeAreas().map((pa) => ({
    url: `${baseUrl}/practice-areas/${pa.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic attorneys
  const attorneys = db.getAttorneys().map((att) => ({
    url: `${baseUrl}/attorneys/${att.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic case studies
  const caseStudies = db.getCaseStudies().map((cs) => ({
    url: `${baseUrl}/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic insights
  const insights = db.getBlogPosts().map((post) => ({
    url: `${baseUrl}/insights/${post.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...practiceAreas, ...attorneys, ...caseStudies, ...insights];
}
