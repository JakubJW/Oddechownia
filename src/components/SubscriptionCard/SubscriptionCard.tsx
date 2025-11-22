'use client';

import { Check } from 'lucide-react';
import { getUser } from '@/server/actions/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';

type User = Awaited<ReturnType<typeof getUser>>;
export interface SubscriptionCardProps {
  name: string;
  priceId: string;
  price: number;
  features: (string | undefined)[];
  user: User | null;
  intervalCount?: number;
  interval?: string;
}

const calculateMonthly = (price: number, intervalCount?: number) => {
  if (!intervalCount) {
    return '--.--';
  }

  return (price / 100 / intervalCount).toFixed(2);
};

export function SubscriptionCard({
  price,
  priceId,
  intervalCount,
  features,
  interval,
  user,
}: SubscriptionCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChoose = async () => {
    if (!user) {
      return router.push(`/rejestracja?priceId=${priceId}`);
    }

    try {
      setIsLoading(true);

      const res = await fetch(`/api/checkout/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          customerId: user.stripeCustomerId,
          clientReferenceId: user.id,
        }),
      });

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

  const formatIntervalCount = (intervalCount?: number, interval?: string) => {
    if (!interval || !intervalCount) return null;

    if (interval === 'month') {
      if (intervalCount === 1) return `${intervalCount} miesiąc`;
      else if (intervalCount > 1 && intervalCount <= 4)
        return `${intervalCount} miesiące`;
      else if (intervalCount > 4 && intervalCount <= 12)
        return `${intervalCount} miesięcy`;
    }
  };

  return (
    <div>
      <span className="font-normal text-lg">
        Odnowa co {formatIntervalCount(intervalCount, interval)}
      </span>
      <div className="mt-4">
        <span className="font-bold text-3xl">
          {(price / 100).toFixed(2)} zł
        </span>
        <span className="text-gray-400 text-sm">
          {calculateMonthly(price, intervalCount)} zł/mies.
        </span>
      </div>
      <ul className="space-y-2 my-4">
        {features.map((feature, index) => {
          if (!feature) {
            return null;
          }

          return (
            <li
              key={index}
              className="flex gap-2"
            >
              <Check className="text-primaryFg flex-shrink-0" />
              <p>{feature}</p>
            </li>
          );
        })}
      </ul>
      <Button
        onClick={handleChoose}
        disabled={isLoading}
      >
        {isLoading ? 'Ładowanie...' : 'Wybierz'}
      </Button>{' '}
    </div>
  );
}
