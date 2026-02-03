import '@/styles/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { env } from '@/env';
import ToastProvider from '@/components/ToastProvider';
import QueryClientProvider from '@/components/QueryClientProvider';
import { getUser } from '@/server/actions/user';
import { Analytics } from '@vercel/analytics/next';
import Chat from '@/features/scripts/chat';
import MailerLiteForms from '@/features/scripts/mailer-lite-forms';
import Hotjar from '@/features/scripts/hotjar';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: 'Twoje miejsce, by złapać oddech',
    template: '%s | Oddechownia',
  },
};

const sourceSans = localFont({
  src: [
    {
      path: '../../public/fonts/source-sans-3-v19-latin-ext-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-sans-3-v19-latin-ext-300italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/source-sans-3-v19-latin-ext-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-sans-3-v19-latin-ext-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-sans-3-v19-latin-ext-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/source-sans-3-v19-latin-ext-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-source-sans',
});

const montserrat = localFont({
  src: [
    {
      path: '../../public/fonts/montserrat-v31-latin-ext-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/montserrat-v31-latin-ext-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/montserrat-v31-latin-ext-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/montserrat-v31-latin-ext-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/montserrat-v31-latin-ext-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-montserrat',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="pl">
      <body
        className={cn(sourceSans.variable, montserrat.variable, 'antialiased')}
      >
        <QueryClientProvider>
          <ToastProvider>
            <Navigation user={user} />
            <main className="mt-[64px] min-h-full">{children}</main>
            <Footer />
          </ToastProvider>
        </QueryClientProvider>
        {env.NODE_ENV !== 'development' && (
          <>
            <Chat />
            <Analytics />
            <MailerLiteForms />
            <Hotjar />
          </>
        )}
      </body>
    </html>
  );
}
