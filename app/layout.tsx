import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://aurelius-law-platform.vercel.app'),
  title: {
    default: 'Aurelius & Co. | Independent Counsel for Consequential Moments',
    template: '%s | Aurelius & Co.',
  },
  description: 'Aurelius & Co. delivers decisive, world-class legal counsel to enterprises, sovereign institutions, and visionary founders in high-stakes corporate, litigation, and regulatory matters.',
  keywords: [
    'International Law Firm',
    'Corporate Law',
    'Cross-Border Mergers and Acquisitions',
    'Commercial Litigation',
    'King’s Counsel',
    'Dispute Resolution',
    'Legal Consultancy',
  ],
  authors: [{ name: 'Aurelius & Co.' }],
  creator: 'Aurelius & Co.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://aurelius-law-platform.vercel.app',
    title: 'Aurelius & Co. | Independent Counsel for Consequential Moments',
    description: 'Bespoke corporate advisory, cross-border M&A, high-stakes dispute resolution, and intellectual property counsel.',
    siteName: 'Aurelius & Co.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurelius & Co. | Independent Counsel for Consequential Moments',
    description: 'Bespoke corporate advisory, cross-border M&A, high-stakes dispute resolution, and intellectual property counsel.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Aurelius & Co.',
    alternateName: 'Aurelius & Co. International Legal Counsel',
    url: 'https://aurelius-law-platform.vercel.app',
    logo: 'https://aurelius-law-platform.vercel.app/icon.svg',
    description:
      'Independent international legal counsel advising sovereign entities, multinational corporations, and visionary founders on high-stakes transactions, cross-border disputes, and intellectual property.',
    telephone: '+44 20 7946 0912',
    email: 'inquiries@aureliuslaw.com',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: '250 Bishopsgate',
        addressLocality: 'London',
        postalCode: 'EC2M 4AA',
        addressCountry: 'GB',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '767 Fifth Avenue',
        addressLocality: 'New York',
        addressRegion: 'NY',
        postalCode: '10153',
        addressCountry: 'US',
      },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '18:30',
    },
    priceRange: '$$$$',
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
