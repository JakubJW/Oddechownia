import { SubscriptionProductDTO } from '@/server/services/billing.service';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderProps = Pick<
  SubscriptionProductDTO,
  'features' | 'interval' | 'amount' | 'intervalCount'
> & { className?: string };

export default function Order({
  features,
  intervalCount,
  amount,
  className,
}: OrderProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <p className="text-muted-foreground font-light text-lg">
        Twoje zamówienie
      </p>
      <div>
        <div className="mt-4 space-x-2">
          <span className={cn('font-bold text-3xl')}>
            {(amount / 100).toFixed(2)} zł
          </span>
          <span className="text-muted-foreground font-light text-sm">
            płatne co {intervalCount} miesiąc
          </span>
        </div>
        <ul className="space-y-2 my-4">
          {features.map((feature, index) => {
            if (!feature) return null;

            return (
              <li
                key={index}
                className="flex gap-2"
              >
                <Check className="size-4 mt-1 text-primaryFg flex-shrink-0" />
                <p className="font-light text-richBlack">{feature}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
