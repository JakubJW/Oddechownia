'use client';

import { buttonVariants } from '../ui/button';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { env } from '@/env';
import { getProfile } from '@/actions/profile';

type Profile = Awaited<ReturnType<typeof getProfile>>;

interface ChooseSubscriptionButtonProps {
  profile: Profile | null;
  route: string;
  stripeProductId: string;
}

const ChooseSubscriptionButton = ({
  profile,
  route,
  stripeProductId,
}: ChooseSubscriptionButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChoose = async () => {
    console.log(profile)

    if (!profile) {
      return router.push(route);
    }

    if (profile.subscriptionStatus === 'active') {
      return router.push('/moje-konto');
    }

    try {
      setIsLoading(true);

      const res = await fetch(
        `${env.NEXT_PUBLIC_APP_URL}/api/checkout/subscription`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stripeProductId,
            customerEmail: profile.email,
            clientReferenceId: profile.id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to create checkout session.');
      }

      const { url } = await res.json();

      window.location.href = url;
    } catch (error) {
      console.error('Checkout failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleChoose}
      disabled={isLoading}
      className={buttonVariants({ variant: 'default' })}
    >
      {isLoading ? 'Ładowanie...' : 'Wybierz'}
    </Button>
  );
};

export default ChooseSubscriptionButton;
