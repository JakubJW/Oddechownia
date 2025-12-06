'use client';

import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, buttonVariants } from '../ui/button';
import { User } from '@/server/actions/user';
import { cn } from '@/lib/utils';
import { env } from '@/env';

type ProductType = 'subscription' | 'live-lesson';

type Props = {
  type: ProductType;
  name: string;
  priceId?: string;
  price: number;
  features: (string | undefined)[];
  user: User;
  interval?: string;
};

const ActionButton = ({
  productType,
  user,
}: {
  productType: ProductType;
  user: User;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChoose = async () => {
    if (!user) {
      return router.push('/rejestracja');
    }

    if (user.hasActiveSubscription) {
      return router.push('/moje-konto');
    }

    try {
      setIsLoading(true);

      const res = await fetch(`/api/subscription/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

  if (productType === 'subscription') {
    return (
      <Button
        size="lg"
        className="mt-auto"
        onClick={handleChoose}
        disabled={isLoading}
      >
        Dołącz do Oddechowni
        {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
      </Button>
    );
  }

  return (
    <a
      href={`${env.NEXT_PUBLIC_APP_URL}/zajecia-na-zywo`}
      className={cn(
        buttonVariants({ size: 'lg', variant: 'secondary' }),
        'mt-auto'
      )}
    >
      Dostępne lekcje
    </a>
  );
};

export function ProductCard({
  type,
  name,
  price,
  features,
  interval,
  user,
}: Props) {
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
      <ActionButton
        user={user}
        productType={type}
      />
    </div>
  );
}
