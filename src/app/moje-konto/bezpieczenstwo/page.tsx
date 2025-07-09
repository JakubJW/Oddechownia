import SecurityForm from '@/features/user/Security/Form/SecurityForm';

export default async function Security() {
  return (
    <div className="space-y-4">
      <p className="font-bold text-xl">Bezpieczeństwo</p>
      <SecurityForm />
    </div>
  );
}
