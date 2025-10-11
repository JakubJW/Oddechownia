import { getUser } from '@/actions/user';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const getRequiredUser = cache(async () => {
  const user = await getUser();

  if (!user) {
    redirect('/logowanie');
  }

  return user;
});
