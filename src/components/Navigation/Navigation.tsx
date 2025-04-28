'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/oddechownia.svg';
import MobileNavigation from './MobileNavigation';
import NavigationElement from './NavigationLink';
import type { User } from '@supabase/supabase-js';
import NavigationAction from './NavigationAction';

export const routes = [
  { content: 'Nasze kursy', href: '/nasze-kursy' },
  { content: 'O nas', href: '/o-nas' },
  { content: 'Blog', href: '/blog' },
];

export interface NavigationProps {
  user: User | null;
}

export default function Navigation({ user }: NavigationProps) {
  return (
    <header className="fixed top-0 z-40 w-full bg-matcha flex items-center justify-between">
      <div className="container mx-auto px-4 py-4 sm:py-0">
        <div className="flex justify-between items-center">
          <nav>
            <ul className="flex justify-center sm:justify-start items-center">
              <li>
                <Link
                  className="block mr-8"
                  href="/"
                >
                  <Image
                    src={Logo}
                    alt="Oddechownia logo"
                    priority
                    className='w-[200px]'
                  />
                </Link>
              </li>
              {routes.map(({ content, href }, index) => (
                <li
                  className="hidden sm:block"
                  key={index}
                >
                  <NavigationElement
                    content={content}
                    href={href}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <NavigationAction className='hidden sm:inline-flex' user={user} />
          <MobileNavigation user={user}/>
        </div>
      </div>
    </header>
  );
}
