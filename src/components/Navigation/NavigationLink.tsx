'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface NavigationLinkProps {
  content: string;
  href: string;
  onClick?: () => void;
}

function NavigationLink({ content, href, onClick }: NavigationLinkProps) {
  const currentPath = usePathname();

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'block text-primaryFg border-b-2 py-4 sm:py-6 px-4 hover:border-primaryFg trasition-colors duration-300',
        href.split('/').includes(currentPath.split('/')[1]) &&
          currentPath !== '/'
          ? 'border-primaryFg font-bold'
          : 'border-transparent'
      )}
    >
      {content}
    </Link>
  );
}

export default memo(NavigationLink);
