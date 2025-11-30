import MyDataForm from '@/features/user/MyData/Form/MyDataForm';
import SecurityForm from '@/features/user/Security/Form/SecurityForm';
import { getRequiredUser } from '@/lib/data';

export default async function MyData({}) {
  const user = await getRequiredUser();

  return (
    <section>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="font-bold text-xl mb-4">Moje dane</p>
          <MyDataForm user={user} />
        </div>
        <div className="space-y-4">
          <p className="font-bold text-xl">Bezpieczeństwo</p>
          <SecurityForm />
        </div>
      </div>
    </section>
  );
}
