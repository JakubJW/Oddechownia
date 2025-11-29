'use client';

import { NavigationProps } from './Navigation';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

interface NavigaitonActionProps extends NavigationProps {
  className?: string;
}

export default function NavigationAction({
  user,
  className,
}: NavigaitonActionProps) {
  if (!user) {
    return (
      <Link
        className={cn(
          buttonVariants({ variant: 'secondary', size: 'lg' }),
          className
        )}
        href="/logowanie"
      >
        Zaloguj się
      </Link>
    );
  }

  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'secondary', size: 'lg' }),
        className
      )}
      href="/moje-konto"
    >
      Moje konto
    </Link>
  );
}
