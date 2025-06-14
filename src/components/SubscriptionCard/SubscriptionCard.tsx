import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

const subscriptionCardVariants = cva(
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

export interface SubscriptionCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof subscriptionCardVariants> {
  period: number | null;
  name: string;
  price: number;
  features: { name: string }[];
}

const calculateMonthly = (price: number, period: number | null) => {
  if (!period) {
    return '--.--';
  }

  return (price / 100 / period).toFixed(2);
};

export default function SubscriptionCard({
  period,
  price,
  className,
  variant,
  name,
  features,
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
        {features.map(({ name }, index) => (
          <li
            key={index}
            className="flex gap-2"
          >
            <Check className="text-primaryFg flex-shrink-0" />
            <p>{name}</p>
          </li>
        ))}
      </ul>
      <Link href={`rejestracja/${name}`} className={buttonVariants({ variant: "default"})}>Wybierz</Link>
    </div>
  );
}
