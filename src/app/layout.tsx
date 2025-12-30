import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { env } from '@/env';
import Waitlist from '@/features/Waitlist/Waitlist';
import ToastProvider from '@/components/ToastProvider';
import QueryClientProvider from '@/components/QueryClientProvider';
import { getUser } from '@/server/actions/user';
import { Analytics } from '@vercel/analytics/next';
import TidioWidget from '@/features/user/chat';

export const metadata: Metadata = {
  title: 'Twoje miejsce, by złapać oddech | Oddechownia',
};

const sourceSans = Source_Sans_3({
  display: 'swap',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html
      lang="pl"
      className={sourceSans.className}
    >
      <body className="antialiased">
        <QueryClientProvider>
          <ToastProvider>
            {env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' ? (
              <Waitlist />
            ) : (
              <>
                <Navigation user={user} />
                <main className="mt-[64px] min-h-full">{children}</main>
                <Footer />
              </>
            )}
          </ToastProvider>
        </QueryClientProvider>
        <Analytics />
        <TidioWidget />
      </body>
    </html>
  );
}
