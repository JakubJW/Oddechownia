import { Button } from '@/components/ui/button';
import { signOut } from '../rejestracja/actions';

export default function MyAccount() {
  return (
    <section>
      Moje konto
      <form action={signOut}>
        <Button type="submit">Wyloguj</Button>
      </form>
    </section>
  );
}
