import { ProductCard } from '@/components/SubscriptionCard/product-card';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';
import { getUser } from '@/server/actions/user';
import { stripeService } from '@/server/services/stripe.service';
import Stripe from 'stripe';
import { env } from '@/env';

export default async function AvailableSubscriptions() {
  const user = await getUser();
  const subscriptionPrice = await stripeService.getPrice(
    env.NEXT_STRIPE_SUBSCRIPTION_PRICE_ID
  );
  const liveLessonPrice = await stripeService.getPrice(
    env.NEXT_STRIPE_LIVE_LESSON_PRICE_ID
  );

  const subscriptionProduct = subscriptionPrice.product as Stripe.Product;
  const liveLessonProduct = liveLessonPrice.product as Stripe.Product;

  const subscriptionProductDto = {
    name: subscriptionProduct.name,
    marketingFeatures: subscriptionProduct.marketing_features.map(
      ({ name }) => name
    ),
    price: {
      unitAmount: subscriptionPrice.unit_amount || 0,
      interval: subscriptionPrice.recurring?.interval,
      intervalCount: subscriptionPrice.recurring?.interval_count,
    },
  };

  const liveLessonProductDto = {
    name: liveLessonProduct.name,
    marketingFeatures: liveLessonProduct.marketing_features.map(
      ({ name }) => name
    ),
    price: {
      unitAmount: liveLessonPrice.unit_amount || 0,
    },
  };

  return (
    <section>
      <Container className="overflow-hidden">
        <hgroup className="text-center max-w-[800px] mx-auto space-y-6 mb-24">
          <HeaderTwo>
            Jak możesz <br /> praktykować
            <span className="text-primaryFg">&nbsp;w Oddechowni?</span>
          </HeaderTwo>
        </hgroup>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-16">
          <ProductCard
            type="subscription"
            name={subscriptionProductDto.name}
            price={subscriptionProductDto.price.unitAmount}
            interval={'miesięcznie'}
            features={subscriptionProductDto.marketingFeatures}
            user={user}
          />
          <ProductCard
            type="live-lesson"
            user={user}
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
