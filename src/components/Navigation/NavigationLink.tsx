'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface NavigationLinkProps {
  content: string;
  href: string;
  onClick?: () => void;
  isMobile: boolean;
}

function NavigationLink({
  content,
  href,
  onClick,
  isMobile,
}: NavigationLinkProps) {
  const currentPath = usePathname();

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex border-b-2 h-full items-center px-4 hover:border-richBlack hover:text-richBlack trasition-colors duration-300',
        isMobile ? 'text-richBlack' : 'text-white',
        href.split('/').includes(currentPath.split('/')[1]) &&
          currentPath !== '/' &&
          !isMobile
          ? 'text-richBlack border-richBlack'
          : 'border-transparent'
      )}
    >
      {content}
    </Link>
  );
}

export default memo(NavigationLink);
