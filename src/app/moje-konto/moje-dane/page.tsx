import MyDataForm from '@/features/user/MyData/Form/MyDataForm';
import { getRequiredUser } from '@/lib/data';

export default async function MyData({}) {
  const user = await getRequiredUser();

  return (
    <div className="space-y-4">
      <p className="font-bold text-xl mb-4">Moje dane</p>
      <MyDataForm user={user} />
    </div>
  );
}
