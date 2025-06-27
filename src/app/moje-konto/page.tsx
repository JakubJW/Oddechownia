import { Button } from '@/components/ui/button';
import { signOut } from '../rejestracja/actions';

export default async function MyAccount() {
  return (
    <section>
      Witaj
      <form action={signOut}>
        <Button type="submit">Wyloguj</Button>
      </form>
    </section>
  );
}
