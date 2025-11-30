'use client';

import { cn } from '@/lib/utils';
import { MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import { routes } from './Navigation';
import NavigationLink from './NavigationLink';
import { NavigationProps } from './Navigation';
import NavigationAction from './NavigationAction';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';

export default function MobileNavigation({ user }: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    // <Sheet>
    //   <SheetTrigger>Open</SheetTrigger>
    //   <SheetContent side="right">
    //     <SheetHeader>
    //       <SheetTitle>Are you absolutely sure?</SheetTitle>
    //       <SheetDescription>
    //         This action cannot be undone. This will permanently delete your
    //         account and remove your data from our servers.
    //       </SheetDescription>
    //     </SheetHeader>
    //   </SheetContent>
    // </Sheet>
    <div className="ml-auto flex items-center sm:hidden">
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
