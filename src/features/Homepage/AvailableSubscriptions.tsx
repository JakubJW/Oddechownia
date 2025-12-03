import { SubscriptionCard } from '@/components/SubscriptionCard/SubscriptionCard';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';
import { getUser } from '@/server/actions/user';
import { stripeService } from '@/server/services/stripe.service';
import Stripe from 'stripe';

export default async function AvailableSubscriptions() {
  const user = await getUser();
  const subscription = await stripeService.getProduct('prod_Swifo6V6uVtRlK');
  const liveLesson = await stripeService.getProduct('prod_TOqFXIgRXJ84RK');

  const price = subscription.default_price as Stripe.Price;
  const liveLessonPrice = liveLesson.default_price as Stripe.Price;

  const subscriptionProductDto = {
    name: subscription.name,
    marketingFeatures: subscription.marketing_features.map(({ name }) => name),
    price: {
      id: price.id,
      unitAmount: price.unit_amount || 0,
      interval: price.recurring?.interval,
      intervalCount: price.recurring?.interval_count,
    },
  };

  const liveLessonProductDto = {
    name: liveLesson.name,
    marketingFeatures: liveLesson.marketing_features.map(({ name }) => name),
    price: {
      id: liveLessonPrice.id,
      unitAmount: liveLessonPrice.unit_amount || 0,
    },
  };

  return (
    <section>
      <Container className="overflow-hidden">
        <hgroup className="text-center max-w-[800px] mx-auto space-y-6 mb-24">
          <HeaderTwo>
            Co oferuje <span className="text-primaryFg">Oddechownia?</span>
          </HeaderTwo>
          {/* <p className="text-xl">
            Każdy z pakietów możesz dowolnie przedłużać, aby cieszyć się
            dostępem do platformy tak, jakby to był jogowy Netflix.
          </p> */}
        </hgroup>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-16 lg:gap-10">
          <SubscriptionCard
            name={subscriptionProductDto.name}
            priceId={subscriptionProductDto.price.id}
            price={subscriptionProductDto.price.unitAmount}
            interval={'miesięcznie'}
            features={subscriptionProductDto.marketingFeatures}
            user={user}
          />
          <SubscriptionCard
            name={liveLessonProductDto.name}
            price={liveLessonProductDto.price.unitAmount}
            interval={'jednorazowo'}
            features={liveLessonProductDto.marketingFeatures}
          />
        </div>
      </Container>
    </section>
  );
}
