'use client';

import { getUser } from '@/server/actions/user';
import AccountDropdown from './account-dropdown';
import MobileNavigation from './MobileNavigation';
import { useEffect, useState } from 'react';

export default function AuthStatus() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wywołujemy Server Action wewnątrz useEffect
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Błąd pobierania użytkownika', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return null;
  }

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
