import { OrderSubscriptionCard } from '@/components/SubscriptionCard/OrderSubscriptionCard';
import { SubscriptionProductDTO } from '@/server/services/billing.service';

type OrderProps = Pick<
  SubscriptionProductDTO,
  'features' | 'interval' | 'amount' | 'intervalCount'
>;

export default function Order({ features, interval, intervalCount,amount }: OrderProps) {
  return (
    <div className="flex flex-col col-span-4 col-start-9">
      <p className="font-bold text-xl mb-8">Twoje zamówienie</p>
      <OrderSubscriptionCard
        features={features}
        interval={interval}
        amount={amount}
        intervalCount={intervalCount}
      />
    </div>
  );
}
