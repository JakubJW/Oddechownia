"use-client"

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { useRouter } from 'next/router';

const subscriptionCardVariants = cva(
  'bg-white relative rounded-lg flex flex-col p-8',
  {
    variants: {
      variant: {
        default: 'border',
        popular:
          'border border-primaryFg bg-gradient-to-b from-white to-primaryBg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SubscriptionCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof subscriptionCardVariants> {
  period: number;
  price: number;
}

const features = [
  'nielimitowany dostęp do wszystkich zajęć jogi, relaksacji, medytacji',
  'sesje na różnych poziomach zaawansowania i w różnych stylach jogi',
  'praktykujesz kiedy chcesz i gdzie chcesz, przez 24 godziny, 7 dni w tygodniu',
];

const calculateMonthly = (price: number, period: number) => {
  return price / period;
};

export default function SubscriptionCard({
  period,
  price,
  className,
  variant,
}: SubscriptionCardProps) {
  const router = useRouter();

  return (
    <div className={cn(subscriptionCardVariants({ variant, className }))}>
      <span className="font-bold text-lg">{period} miesiące</span>{' '}
      {variant === 'popular' && (
        <span className="text-sm absolute top-6 right-6 bg-primaryBg p-2 rounded-md text-primaryFg">
          Najpopularniejszy
        </span>
      )}
      <div className="mt-4">
        <span
          className={cn(
            'font-bold text-3xl',
            variant === 'popular' && 'text-primaryFg'
          )}
        >
          {price} zł{' '}
        </span>
        <span className="text-gray-400 text-sm">
          {calculateMonthly(price, period)} zł/mies.
        </span>
      </div>
      <ul className="space-y-2 my-4">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex gap-2"
          >
            <Check className="text-primaryFg flex-shrink-0" />
            <p>{feature}</p>
          </li>
        ))}
      </ul>
      <Button
        variant={variant === 'default' ? 'outline' : 'default'}
        size="lg"
        onClick={() => router.push('/checkout')}
      >
        Wybierz
      </Button>
    </div>
  );
}
