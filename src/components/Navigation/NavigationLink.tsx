'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  content: string;
  href: string;
  onClick?: () => void;
}

export default function NavigationLink({
  content,
  href,
  onClick,
}: NavigationLinkProps) {
  const currentPath = usePathname();

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'block text-primaryFg border-b-2 py-4 sm:py-6 px-4 hover:border-primaryFg trasition-colors duration-300',
        currentPath === href
          ? 'border-primaryFg font-bold'
          : 'border-transparent'
      )}
    >
      {content}
    </Link>
  );
}
