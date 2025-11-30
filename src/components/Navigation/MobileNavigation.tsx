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
    <div className="flex items-center sm:hidden">
      <button onClick={() => setOpen(true)}>
        <MenuIcon className="text-white" />
      </button>
      <div
        className={cn(
          'absolute p-4 bg-white top-0 left-0 h-screen w-full flex flex-col opacity-0 pointer-events-none transition-opacity duration-300',
          open && 'opacity-1 pointer-events-auto'
        )}
      >
        <button
          className="inline-flex w-min self-end"
          onClick={() => setOpen(false)}
        >
          <X className="text-richBlack" />
        </button>
        <ul className="-mx-4 flex flex-col gap-4">
          {routes.map(({ content, href }, index) => (
            <li key={index}>
              <NavigationLink
                isMobile={true}
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
