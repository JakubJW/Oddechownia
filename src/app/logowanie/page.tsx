import { login } from '../rejestracja/actions';
import { Button } from '@/components/ui/button';

export default function Login() {
  return (
    <section>
      Logowanie
      <form action={login}>
        <input
          type="text"
          name="email"
        />
        <input
          type="password"
          name="password"
        />
        <Button type="submit">Zaloguj</Button>
      </form>
    </section>
  );
}
