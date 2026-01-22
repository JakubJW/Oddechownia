import { getUser } from '@/server/actions/user';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const getRequiredUser = cache(async () => {
  const user = await getUser();

  if (!user) {
    redirect('/rejestracja');
  }

  return user;
});
