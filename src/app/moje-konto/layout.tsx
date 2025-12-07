import Container from '@/components/Container/Container';
import TidioWidget from '@/features/user/chat';
import { getRequiredUser } from '@/lib/data';
import { Wind } from 'lucide-react';
import Script from 'next/script';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getRequiredUser();

  return (
    <Container className="py-8 lg:py-24">
      <div className="mb-8">
        <div className="flex justify-between">
          <h1 className="text-xl font-light">
            Witaj ponownie, &nbsp;
            <span className="text-primary font-light">
              <Wind
                className="size-6 inline ml-1"
                strokeWidth={1}
              />
            </span>
          </h1>
          <TidioWidget />
        </div>
      </div>
      {children}
      <Script src="//code.tidio.co/05hblgc0qsamnmve3czeijgqr8sj7yyt.js" />
    </Container>
  );
}
