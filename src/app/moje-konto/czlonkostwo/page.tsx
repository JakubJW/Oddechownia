import { getRequiredUser } from '@/lib/data';

export default async function Membership({}) {
  const user = await getRequiredUser();

  return (
    <>
      <form
        action="/api/stripe/create-checkout-portal"
        method="POST"
      >
        <input
          type="hidden"
          name="customerId"
          value={user.stripeCustomerId}
        />
        <button type="submit">Zarządzaj</button>
      </form>
    </>
  );
}
