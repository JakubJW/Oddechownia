import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/oddechownia.svg';
import MobileNavigation from './MobileNavigation';
import NavigationLink from './NavigationLink';
import AccountDropdown from './account-dropdown';
import { User } from '@/server/actions/user';
import { filteredRoutes } from '@/utils/navigation';

export interface NavigationProps {
  user: User | null;
}

export default function Navigation({ user }: NavigationProps) {
  return (
    <header className="fixed top-0 z-40 w-full bg-matcha">
      {user && user.subscriptionStatus === 'past_due' && (
        <div className="bg-yellow-300 text-sm text-center py-1">
          Podczas odnowy subskrypcji wystąpił problem z płatnością. Sprawdź, czy
          masz środki na koncie lub{' '}
          <form
            action="/api/stripe/create-checkout-portal"
            method="POST"
            className="inline"
          >
            <input
              type="hidden"
              name="customerId"
              value={user.stripeCustomerId!}
            />
            <button
              className="underline"
              type="submit"
            >
              zaktualizuj metodę płatności tutaj.
            </button>
          </form>
        </div>
      )}
      <div className="container h-[64px] mx-auto px-4">
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
              {filteredRoutes(user).map(({ content, href }, index) => (
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
        </div>
      </div>
    </header>
  );
}
