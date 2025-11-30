import Container from '@/components/Container/Container';
import Link from 'next/link';
import { getRequiredUser } from '@/lib/data';
import { Wind } from 'lucide-react';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getRequiredUser();

  return (
    <>
      {!user.hasActiveSubscription && user.role === 'user' && (
        <div className="max-w-lg p-4 rounded-md border border-steelBlue">
          <p>
            Witaj, {user.firstName} {user.lastName}! Wygląda na to, że nie
            posiadasz wykupionej subskrypcji. Aby tego dokończyć proces, kliknij
            w ten link i &nbsp;
            <Link
              href="/dolacz-do-nas"
              className="underline text-matcha"
            >
              dołącz do nas!
            </Link>
          </p>
        </div>
      )}
      <Container className="py-24">
        <div className="pb-8 mb-8">
          <h1 className="text-xl font-light">
            Witaj ponownie, &nbsp;
            <span className="text-primary font-light">
              {user.firstName}
              <Wind
                className="size-6 inline ml-1"
                strokeWidth={1}
              />
            </span>
          </h1>
        </div>
        {children}
      </Container>
    </>
  );
}
