import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { signOut } from '@/server/actions/auth';

type Props = {
  className?: string;
};

export const NavigationButtons = ({ className }: Props) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Link
        href="/moje-konto/ulubione-lekcje"
        className={cn(buttonVariants({ variant: 'secondary' }))}
      >
        Ulubione lekcje
      </Link>
      <Link
        href="/moje-konto/zajecia-na-zywo"
        className={cn(buttonVariants({ variant: 'secondary' }))}
      >
        Moje zajęcia na żywo
      </Link>
      <Link
        href="/moje-konto/ustawienia"
        className={cn(buttonVariants({ variant: 'secondary' }))}
      >
        Ustawienia konta
      </Link>
      <form
        action={signOut}
        className="inline-flex"
      >
        <button
          className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
          type="submit"
        >
          Wyloguj
        </button>
      </form>
    </div>
  );
};
