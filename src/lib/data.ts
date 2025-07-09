import { getUser } from '@/actions/user';
import { redirect } from 'next/navigation';

export const getRequiredUser = async () => {
  const user = await getUser();

  if (!user) {
    redirect('/logowanie');
  }

  return user;
};
