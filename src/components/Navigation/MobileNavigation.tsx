'use client';

import { cn } from '@/lib/utils';
import { MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import NavigationLink from './NavigationLink';
import { NavigationProps } from './Navigation';
import { filteredRoutes } from '@/utils/navigation';
import { signOut } from '@/server/actions/auth';

export default function MobileNavigation({ user }: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center md:hidden">
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
          {filteredRoutes(user).map(({ content, href }, index) => (
            <li key={index}>
              <NavigationLink
                isMobile={true}
                content={content}
                href={href}
                onClick={() => setOpen(false)}
              />
            </li>
          ))}
          {user?.isAdmin && (
            <li>
              <NavigationLink
                isMobile={true}
                content="Admin"
                href="/admin"
                onClick={() => setOpen(false)}
              />
            </li>
          )}
          {user && (
            <>
              <li>
                <NavigationLink
                  isMobile={true}
                  content="Moja praktyka"
                  href="/moje-konto"
                  onClick={() => setOpen(false)}
                />
              </li>
              {/* <li>
                <NavigationLink
                  isMobile={true}
                  content="Społeczność"
                  href="/spolecznosc"
                  onClick={() => setOpen(false)}
                />
              </li> */}
              <li>
                <NavigationLink
                  isMobile={true}
                  content="Moje zajęcia na żywo"
                  href="/moje-konto/zajecia-na-zywo"
                  onClick={() => setOpen(false)}
                />
              </li>
              <li>
                <NavigationLink
                  isMobile={true}
                  content="Ulubione lekcje"
                  href="/moje-konto/ulubione-lekcje"
                  onClick={() => setOpen(false)}
                />
              </li>
              <li>
                <NavigationLink
                  isMobile={true}
                  content="Ustawienia"
                  href="/moje-konto/ustawienia"
                  onClick={() => setOpen(false)}
                />
              </li>
              <li>
                <NavigationLink
                  isMobile={true}
                  content="Wyloguj"
                  href="#"
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                  }}
                />
              </li>
            </>
          )}
          {!user && (
            <li>
              <NavigationLink
                isMobile={true}
                content="Logowanie"
                href="/logowanie"
                onClick={async () => {
                  setOpen(false);
                }}
              />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
