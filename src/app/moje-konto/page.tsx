import { Button } from '@/components/ui/button';
import { signOut } from '../rejestracja/actions';
import { getProfile } from '@/actions/profile';

export default async function MyAccount() {
  const user = await getProfile();

  return (
    <section>
      Witaj, {user?.firstName} {user?.lastName}
      <form action={signOut}>
        <Button type="submit">Wyloguj</Button>
      </form>
    </section>
  );
}
