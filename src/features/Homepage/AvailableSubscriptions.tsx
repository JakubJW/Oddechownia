'use server';

import SubscriptionCard from '@/components/SubscriptionCard/SubscriptionCard';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';
import { db } from '@/db';

const subscriptions = await db.query.stripeProducts.findMany({
  with: {
    stripePrice: true,
  },
});

export default async function AvailableSubscriptions() {
  return (
    <section>
      <Container className="overflow-hidden">
        <hgroup className="text-center max-w-[800px] mx-auto space-y-6 mb-24">
          <HeaderTwo>
            Wybierz <span className="text-primaryFg">swój</span> plan
          </HeaderTwo>
          <p className="text-xl">
            Każdy z pakietów możesz dowolnie przedłużać, aby cieszyć się
            dostępem do platformy tak, jakby to był jogowy Netflix.
          </p>
        </hgroup>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
          {!subscriptions.length && (
            <div className="col-span-full">
              Brak dodanych opcji subskrypcji.
            </div>
          )}

          {subscriptions.map(
            ({ stripeProductId, stripePrice, marketingFeatures, name }) => (
              <SubscriptionCard
                key={stripeProductId}
                name={name}
                period={stripePrice.intervalCount}
                price={stripePrice.unitAmount}
                variant={
                  stripePrice.intervalCount === 3 ? 'popular' : 'default'
                }
                features={marketingFeatures}
              />
            )
          )}
        </div>
      </Container>
    </section>
  );
}
