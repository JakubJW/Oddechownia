import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type SubscriptionProductDTO = {
  id: string;
  name: string;
  description: string | null;
  priceId: string;
  amount: number;
  interval?: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  features: (string | undefined)[];
};

type OrderProps = Pick<
  SubscriptionProductDTO,
  'features' | 'interval' | 'amount' | 'intervalCount'
> & { className?: string };

export default function Order({ features, className }: OrderProps) {
  return (
    <div
      className={cn(
        'border border-emerald-100 shadow-lg shadow-emerald-200 rounded-xl p-6 flex flex-col',
        className
      )}
    >
      <div className="mt-4 rounded-lg font-light">
        <h2 className="font-normal text-xl xl:text-xl uppercase">
          3-dniowy okres próbny{' '}
          <span className="lowercase whitespace-nowrap text-sm text-muted-foreground">
            (potem 129,00 zł miesięcznie)
          </span>
        </h2>
        <span className="block mt-4">Anuluj w każdej chwili</span>
        <p>
          Do zapłaty dzisiaj: <strong>0,00 zł</strong>
        </p>
      </div>
      <ul className="space-y-3 my-4">
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
  );
}
