import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Stripe from 'stripe';
import ChooseSubscriptionButton from './ChooseSubscriptionButton';
import { getUser } from '@/actions/user';

export const subscriptionCardVariants = cva(
  'bg-white relative rounded-lg flex flex-col p-8',
  {
    variants: {
      variant: {
        default: 'border',
        popular:
          'border border-matcha bg-gradient-to-b from-white to-matcha-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type User = Awaited<ReturnType<typeof getUser>>;
export interface SubscriptionCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof subscriptionCardVariants> {
  period: number | null;
  name: string;
  stripeProductId: string;
  price: number;
  features: Stripe.Product.MarketingFeature[];
  user: User | null;
}

const calculateMonthly = (price: number, period: number | null) => {
  if (!period) {
    return '--.--';
  }

  return (price / 100 / period).toFixed(2);
};

export function SubscriptionCard({
  period,
  price,
  name,
  stripeProductId,
  className,
  variant,
  features,
  user,
}: SubscriptionCardProps) {
  return (
    <div className={cn(subscriptionCardVariants({ variant, className }))}>
      <span className="font-normal text-lg">{period} miesiące</span>{' '}
      {variant === 'popular' && (
        <span className="text-sm absolute top-6 right-6 bg-primaryBg p-2 rounded-md text-primaryFg">
          Popularny
        </span>
      )}
      <div className="mt-4">
        <span
          className={cn(
            'font-bold text-3xl',
            variant === 'popular' && 'text-primaryFg'
          )}
        >
          {(price / 100).toFixed(2)} zł{' '}
        </span>
        <span className="text-gray-400 text-sm">
          {calculateMonthly(price, period)} zł/mies.
        </span>
      </div>
      <ul className="space-y-2 my-4">
        {features.map(({ name }) => (
          <li
            key={name}
            className="flex gap-2"
          >
            <Check className="text-primaryFg flex-shrink-0" />
            <p>{name}</p>
          </li>
        ))}
      </ul>
      <ChooseSubscriptionButton
        user={user}
        route={`/rejestracja/${name}`}
        stripeProductId={stripeProductId}
      />
    </div>
  );
}
