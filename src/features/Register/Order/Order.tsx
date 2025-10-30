import { OrderSubscriptionCard } from '@/components/SubscriptionCard/OrderSubscriptionCard';
import { stripeProducts, stripePrices } from '@/server/db/schema';

type StripeProductWithPrice = typeof stripeProducts.$inferSelect & {
  stripePrices: (typeof stripePrices.$inferSelect)[];
};

export default function Order({
  stripeProduct,
}: {
  stripeProduct: StripeProductWithPrice;
}) {
  return (
    <div className="flex flex-col col-span-4 col-start-9">
      <p className="font-bold text-xl mb-8">Twoje zamówienie</p>
      <OrderSubscriptionCard
        features={stripeProduct.marketingFeatures}
        variant="popular"
        period={stripeProduct.stripePrices[0].intervalCount}
        price={stripeProduct.stripePrices[0].unitAmount}
      />
    </div>
  );
}
