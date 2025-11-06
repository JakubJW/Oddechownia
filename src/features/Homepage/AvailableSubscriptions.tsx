import { SubscriptionCard } from '@/components/SubscriptionCard/SubscriptionCard';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';
import { getUser } from '@/server/actions/user';
import { BillingService } from '@/server/services/billing.service';

export default async function AvailableSubscriptions() {
  const user = await getUser();
  const subscriptions = await BillingService.getActiveSubscriptionProducts();

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
            ({ id, interval, amount, priceId, features, name, intervalCount }) => (
              <SubscriptionCard
                key={id}
                name={name}
                priceId={priceId}
                price={amount}
                intervalCount={intervalCount}
                interval={interval}
                features={features}
                user={user}
              />
            )
          )}
        </div>
      </Container>
    </section>
  );
}
