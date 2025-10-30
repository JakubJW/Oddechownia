import Container from '@/components/Container/Container';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/server/actions/auth';
import { getRequiredUser } from '@/lib/data';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getRequiredUser();

  if (
    user.subscriptions.every(
      (subscription) => subscription.status === 'inactive'
    )
  ) {
    return (
      <div className="col-span-12">
        <p>
          Witaj, {user.firstName} {user.lastName}! Wygląda na to, że nie
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
    <Container>
      <div className="grid grid-cols-12">
        <div className="flex flex-col gap-4 col-span-2">
          <Link href="/moje-konto/moje-kursy">Moje kursy</Link>
          <Link href="/moje-konto/moje-dane">Moje dane</Link>
          <Link href="/moje-konto/czlonkostwo">Członkostwo</Link>
          <Link href="/moje-konto/bezpieczenstwo">Bezpieczeństwo</Link>
          <form action={signOut}>
            <button type="submit">Wyloguj</button>
          </form>
        </div>
        <div className="col-span-10">{children}</div>
      </div>
    </Container>
  );
}
