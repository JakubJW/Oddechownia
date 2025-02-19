import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/oddechownia.svg';
import MobileNavigation from './MobileNavigation';
import NavigationElement from './NavigationLink';
import { Button } from '../ui/button';

export const routes = [
  { content: 'Nasze kursy', href: '/nasze-kursy' },
  { content: 'O nas', href: '/o-nas' },
  { content: 'Blog', href: '/blog' },
];

export default function Navigation() {
  return (
    <div className="flex items-center justify-between p-4">
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
      <MobileNavigation />
      <Button
        size="lg"
        variant="outline"
        onClick={() => console.log('logowanie')}
        className="hidden sm:block"
      >
        Zaloguj się
      </Button>
    </div>
  );
}
