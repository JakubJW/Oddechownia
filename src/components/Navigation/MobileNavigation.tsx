'use client';

import { cn } from '@/lib/utils';
import { MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import { routes } from './Navigation';
import NavigationLink from './NavigationLink';
import { NavigationProps } from './Navigation';
import NavigationAction from './NavigationAction';

export default function MobileNavigation({ user }: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ml-auto sm:hidden">
      <button onClick={() => setOpen(true)}>
        <MenuIcon className="text-primaryFg" />
      </button>
      <div
        className={cn(
          'absolute p-4 bg-whiteBg top-0 left-0 h-screen w-full flex flex-col opacity-0 pointer-events-none transition-opacity duration-300',
          open && 'opacity-1 pointer-events-auto'
        )}
      >
        <button
          className="inline-flex justify-end"
          onClick={() => setOpen(false)}
        >
          <X className="text-primaryFg" />
        </button>
        <ul className="flex flex-col gap-4 items-center">
          {routes.map(({ content, href }, index) => (
            <li key={index}>
              <NavigationLink
                content={content}
                href={href}
                onClick={() => setOpen(false)}
              />
            </li>
          ))}
          <NavigationAction user={user} />
        </ul>
      </div>
    </div>
  );
}
