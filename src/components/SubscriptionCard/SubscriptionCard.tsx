'use client';

import { Check } from 'lucide-react';
import { getUser } from '@/server/actions/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';

type User = Awaited<ReturnType<typeof getUser>>;

export interface SubscriptionCardProps {
  name: string;
  priceId?: string;
  price: number;
  features: (string | undefined)[];
  user?: User | null;
  interval?: string;
}

export function SubscriptionCard({
  name,
  price,
  priceId,
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

  return (
    <div className="flex flex-col">
      <span className="font-light text-base">{name}</span>
      <div className="mt-2">
        <span className="font-bold text-3xl">
          {(price / 100).toFixed(2)} zł
        </span>
        <span className="text-gray-400 text-sm ml-2">{interval}</span>
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
        size="lg"
        className="mt-auto"
        onClick={handleChoose}
        disabled={isLoading}
      >
        {isLoading ? 'Ładowanie...' : 'Dołącz do Oddechowni'}
      </Button>{' '}
    </div>
  );
}
