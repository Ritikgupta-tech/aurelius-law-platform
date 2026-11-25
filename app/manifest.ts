import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aurelius & Co. Legal Platform',
    short_name: 'Aurelius & Co.',
    description: 'Independent Counsel for Consequential Moments.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07182E',
    theme_color: '#07182E',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
