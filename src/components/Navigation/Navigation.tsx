import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/oddechownia.svg';
import MobileNavigation from './MobileNavigation';
import NavigationLink from './NavigationLink';
import NavigationAction from './NavigationAction';
import { User } from '@/server/actions/user';

export const routes = [
  { content: 'Studio Jogi Online', href: '/studio-jogi-online' },
  // { content: 'O nas', href: '/o-nas' },
  { content: 'Zajęcia na żywo', href: '/zajecia-na-zywo' },
  { content: 'Społeczność', href: '/spolecznosc' },
];

export interface NavigationProps {
  user: User | null;
}

export default function Navigation({ user }: NavigationProps) {
  return (
    <header className="fixed top-0 z-40 h-[64px] w-full bg-matcha flex items-center justify-between">
      <div className="container h-full mx-auto px-4">
        <div className="flex h-full justify-between items-center">
          <nav className="h-full">
            <ul className="h-full flex justify-center sm:justify-start items-center">
              <li className="h-full py-4">
                <Link
                  className="block mr-8 h-full"
                  href="/"
                >
                  <Image
                    src={Logo}
                    alt="Oddechownia logo"
                    priority
                    className="h-full w-min"
                  />
                </Link>
              </li>
              {routes.map(({ content, href }, index) => (
                <li
                  className="hidden sm:block h-full"
                  key={index}
                >
                  <NavigationLink
                    isMobile={false}
                    content={content}
                    href={href}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <NavigationAction
            className="hidden sm:inline-flex"
            user={user}
          />
          <MobileNavigation user={user} />
        </div>
      </div>
    </header>
  );
}
