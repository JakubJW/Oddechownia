'use client';

import { MenuIcon } from 'lucide-react';
import NavigationLink from './NavigationLink';
import { navbarLinks } from '@/utils/navigation';
import { useAuth } from '../AuthProvider';
import { User } from '@/server/actions/user';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';

export default function MobileNavigation({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const { logOut } = useAuth();

  return (
    <div className="flex items-center md:hidden">
      <Sheet
        onOpenChange={setOpen}
        open={open}
      >
        <SheetTrigger asChild>
          <button>
            <MenuIcon className="text-richBlack" />
          </button>
        </SheetTrigger>
        <SheetContent side="right">
          <ul className="flex flex-col gap-4 mt-8">
            {navbarLinks.map(({ content, href }, index) => (
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
                      await logOut();
                      setOpen(false);
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
                  onClick={() => setOpen(false)}
                />
              </li>
            )}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
}
