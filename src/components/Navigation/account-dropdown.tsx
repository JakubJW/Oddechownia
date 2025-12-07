'use client';

import { NavigationProps } from './Navigation';
import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Settings,
  User,
  Video,
  Heart,
  LogOut,
  UserStar,
  Users,
  Leaf,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { signOut } from '@/server/actions/auth';

interface NavigaitonActionProps extends NavigationProps {
  className?: string;
}

export default function AccountDropdown({
  user,
  className,
}: NavigaitonActionProps) {
  const router = useRouter();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(className)}
          variant="secondary"
        >
          <User className="size-5 mr-1" /> Moje konto
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user?.isAdmin && (
          <DropdownMenuItem onClick={() => router.push('/admin')}>
            <UserStar className="size-4 mr-1" />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/moje-konto')}>
          <Leaf className="size-4 mr-1" />
          Moja praktyka
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/spolecznosc')}>
          <Users className="size-4 mr-1" />
          Społeczność
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/moje-konto/zajecia-na-zywo')}
        >
          <Video className="size-4 mr-1" />
          Moje zajęcia na żywo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/moje-konto/ulubione-lekcje')}
        >
          <Heart className="size-4 mr-1" />
          Ulubione lekcje
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/moje-konto/ustawienia')}>
          <Settings className="size-4 mr-1" />
          Ustawienia
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => await signOut()}>
          <LogOut className="size-4 mr-1" /> Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
