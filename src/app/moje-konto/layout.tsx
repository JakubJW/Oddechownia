import Container from '@/components/Container/Container';
import Link from 'next/link';
import { getProfile } from '@/actions/profile';
import { Button } from '@/components/ui/button';
import { signOut } from '../rejestracja/actions';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (profile?.subscriptionStatus === 'inactive') {
    return (
      <div className="col-span-12">
        <p>
          Witaj, {profile?.firstName} {profile?.lastName}! Wygląda na to, że nie
          posiadasz wykupionej subskrypcji. Aby tego dokończyć proces, kliknij w
          ten link i{' '}
          <Link
            href="/dolacz-do-nas"
            className="underline text-matcha"
          >
            dołącz do nas!
          </Link>
        </p>
        <form action={signOut}>
          <Button type="submit">Wyloguj</Button>
        </form>
      </div>
    );
  }

  return (
    <section>
      <Container>
        <div className="grid grid-cols-12">
          <div className="flex flex-col gap-4 col-span-2">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/blog">Blog</Link>
            <Link href="/admin/kursy">Kursy</Link>
          </div>
          <div className="col-span-10">{children}</div>
        </div>
      </Container>
    </section>
  );
}
