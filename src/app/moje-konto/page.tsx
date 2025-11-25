import CaledarGrid from '@/features/user/Calendar/CalendarGrid';
import { getRequiredUser } from '@/lib/data';

export default async function MyAccount() {
  const user = await getRequiredUser();

  return <CaledarGrid user={user} />;
}
