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
      <Container>
        <div className="grid grid-cols-12">
          <div className="flex flex-col gap-4 col-span-2">
            <Link href="/moje-konto">Kalendarz</Link>
            <Link href="/moje-konto/ulubione-lekcje">Ulubione lekcje</Link>
            <Link href="/moje-konto/zajecia-na-zywo">Zajęcia na żywo</Link>
            <Link href="/moje-konto/moje-dane">Moje dane</Link>
            <Link href="/moje-konto/czlonkostwo">Członkostwo</Link>
            <Link href="/moje-konto/bezpieczenstwo">Bezpieczeństwo</Link>
            <form action={signOut}>
              <button type="submit">Wyloguj</button>
            </form>
          </div>
          <div className="col-span-10">
            <div>{children}</div>
          </div>
        </div>
      </Container>
    </>
  );
}
