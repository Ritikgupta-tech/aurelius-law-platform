import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aurelius-law-platform.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/admin/', '/admin', '/attorney'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
