import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { SubscriptionProductDTO } from '@/server/services/billing.service';

const calculateMonthly = (price: number, intervalCount?: number) => {
  if (!intervalCount) {
    return '--.--';
  }

  return (price / 100 / intervalCount).toFixed(2);
};

export function OrderSubscriptionCard({
  intervalCount,
  features,
  amount,
}: Pick<
  SubscriptionProductDTO,
  'amount' | 'features' | 'interval' | 'intervalCount'
>) {
  return (
    <div>
      <span className="font-normal text-lg">{intervalCount} miesiące</span>
      <div className="mt-4">
        <span className={cn('font-bold text-3xl')}>
          {(amount / 100).toFixed(2)} zł
        </span>
        <span className="text-gray-400 text-sm">
          {calculateMonthly(amount, intervalCount)} zł/mies.
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
              <Check className="text-primaryFg flex-shrink-0" />
              <p>{feature}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
