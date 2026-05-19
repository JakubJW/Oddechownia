'use client';

import { useAuth } from '../AuthProvider';
import AccountDropdown from './account-dropdown';
import MobileNavigation from './MobileNavigation';

export default function AuthStatus() {
  const { user } = useAuth();

  return (
    <>
      <AccountDropdown
        className="hidden md:inline-flex"
        user={user}
      />
      <MobileNavigation user={user} />
    </>
  );
}
