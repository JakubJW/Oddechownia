import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';

export default async function MyAccount() {
  return (
    <>
      Witaj
      <form action={signOut}>
        <Button type="submit">Wyloguj</Button>
      </form>
    </>
  );
}
