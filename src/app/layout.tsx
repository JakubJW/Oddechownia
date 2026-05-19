import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation/Navigation';
import QueryClientProvider from '@/components/QueryClientProvider';
import ToastProvider from '@/components/ToastProvider';
import { env } from '@/env';
// import Chat from '@/features/scripts/chat';
import Hotjar from '@/features/scripts/hotjar';
import MailerLiteForms from '@/features/scripts/mailer-lite-forms';
import { montserrat, sourceSans } from '@/fonts';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  alternates: {
    canonical: './',
  },
  title: {
    default: 'Twoje miejsce, by złapać oddech | Oddechownia Studio Jogi',
    template: '%s | Oddechownia',
  },
  description:
    'Oddechownia to czuła przestrzeń, w której łączymy ruch z bezruchem, wiedzę z doświadczaniem, a duchowość z codziennością. Sprawdź i rozpocznij swoją pierwszą praktykę.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      className={cn(sourceSans.variable, montserrat.variable, 'antialiased')}
    >
      <body>
        <QueryClientProvider>
          <ToastProvider>
            <Navigation />
            <main className="mt-16 min-h-full">{children}</main>
            <Footer />
          </ToastProvider>
        </QueryClientProvider>
        {env.NODE_ENV !== 'development' && (
          <>
            {/* <Chat /> */}
            <Analytics />
            <MailerLiteForms />
            <Hotjar />
          </>
        )}
      </body>
    </html>
  );
}
