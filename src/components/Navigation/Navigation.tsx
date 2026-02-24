import Link from 'next/link';
import Logo from '@/assets/oddechownia.svg';
import MobileNavigation from './MobileNavigation';
import NavigationLink from './NavigationLink';
import AccountDropdown from './account-dropdown';
import { User } from '@/server/actions/user';
import { navbarLinks } from '@/utils/navigation';
import { SubscriptionRenewalFailed } from './subscription-renewal-failed';
import Container from '../Container/Container';

export interface NavigationProps {
  user: User | null;
}

export default function Navigation({ user }: NavigationProps) {
  return (
    <header className="fixed top-0 z-40 w-full bg-matcha">
      <SubscriptionRenewalFailed user={user} />
      <Container className="py-0 px-4 flex justify-between items-center h-[64px]">
        <nav className="h-full">
          <ul className="h-full flex justify-center sm:justify-start items-center">
            <li className="h-full py-4">
              <Link
                className="block mr-8 h-full"
                href="/"
              >
                <Logo className="text-richBlack h-full w-min" />
              </Link>
            </li>
            {navbarLinks.map(({ content, href }, index) => (
              <li
                className="hidden md:block h-full"
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
        <AccountDropdown
          className="hidden md:inline-flex"
          user={user}
        />
        <MobileNavigation user={user} />
      </Container>
    </header>
  );
}
