import { SubscriptionCard } from '@/components/SubscriptionCard/SubscriptionCard';
import { stripeProducts } from '@/db/schema';

export default function Order({
  stripeProduct,
}: {
  stripeProduct: typeof stripeProducts.$inferSelect;
}) {
  return (
    <div className="flex flex-col col-span-4 col-start-9">
      <p className="font-bold text-xl mb-8">Twoje zamówienie</p>
      <SubscriptionCard
        features={stripeProduct.marketingFeatures}
        variant="popular"
        period={stripeProduct.stripePrice.intervalCount}
        price={stripeProduct.stripePrice.unitAmount}
        name={stripeProduct.name}
        showCTAButton={false}
      />
    </div>
  );
}
