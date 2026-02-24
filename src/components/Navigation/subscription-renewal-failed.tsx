import { User } from '@/server/actions/user';

type Props = {
  user: User | null;
};

export const SubscriptionRenewalFailed = ({ user }: Props) => {
  if (!user || user.subscriptionStatus !== 'past_due') return null;

  return (
    <div className="bg-yellow-300 text-sm text-center py-1">
      Podczas odnowy subskrypcji wystąpił problem z płatnością. Sprawdź, czy
      masz środki na koncie lub{' '}
      <form
        action="/api/stripe/create-checkout-portal"
        method="POST"
        className="inline"
      >
        <input
          type="hidden"
          name="customerId"
          value={user.stripeCustomerId!}
        />
        <button
          className="underline"
          type="submit"
        >
          zaktualizuj metodę płatności tutaj.
        </button>
      </form>
    </div>
  );
};
