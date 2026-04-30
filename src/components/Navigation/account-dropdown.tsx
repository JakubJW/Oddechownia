'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Settings,
  User as UserIcon,
  Video,
  Heart,
  LogOut,
  UserStar,
  Leaf,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { signOut } from '@/server/actions/auth';
import { User } from '@/server/actions/user';

interface NavigaitonActionProps {
  user: User;
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
          buttonVariants({ size: 'lg' }),
          'bg-white hover:bg-matcha-light rounded-full text-richBlack font-semibold',
          className
        )}
        href="/logowanie"
      >
        Logowanie
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            buttonVariants({ size: 'lg' }),
            'bg-white hover:bg-matcha-light rounded-full text-richBlack font-semibold',
            className
          )}
        >
          <UserIcon className="size-4 mr-2" /> Moje konto
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
