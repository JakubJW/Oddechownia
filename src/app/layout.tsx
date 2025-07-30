import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { createClient } from '@/supabase/server';
import { env } from '@/env';
import Waitlist from '@/features/Waitlist/Waitlist';

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="pl"
      className={sourceSans.className}
    >
      <body className="antialiased">
        {env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' ? (
          <Waitlist />
        ) : (
          <>
            <Navigation user={user} />
            <main className="mt-[64px] sm:mt-[74px]">{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
