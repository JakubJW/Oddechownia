import Container from '@/components/Container/Container';
import TidioWidget from '@/features/user/chat';
import { getRequiredUser } from '@/lib/data';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  robots: 'noindex,nofollow',
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredUser();

  return (
    <Container className="py-8 lg:py-24 h-full">
      {children}
      <TidioWidget />
      <Script src="//code.tidio.co/05hblgc0qsamnmve3czeijgqr8sj7yyt.js" />
    </Container>
  );
}
