import { MetadataRoute } from 'next';
import { env } from '@/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/moje-konto/*',
        '/api/*',
        '/admin/*',
        '/webhooks/*',
        '/zajecia-na-zywo/*',
        '/rejestracja/*',
        '/logowanie',
        '/zapomnialem-hasla',
        '/ustaw-nowe-haslo',
        '/wymagana-subskrypcja',
        '/spolecznosc',
      ],
    },
    sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
