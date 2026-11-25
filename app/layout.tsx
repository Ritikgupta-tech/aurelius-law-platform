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
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
