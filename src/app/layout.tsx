import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Comfortaa } from 'next/font/google';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import { createClient } from '@/supabase/server';

export const metadata: Metadata = {
  title: 'Twoje studio yogi online | Oddechownia',
};

const comfortaa = Comfortaa({
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
      className={comfortaa.className}
    >
      <body className="antialiased">
        <Navigation user={user} />
        <main className="mt-[64px] sm:mt-[76px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
