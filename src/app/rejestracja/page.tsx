import { RegisterForm } from '@/features/Register/Form/register-form';
import Order from '@/features/Register/Order/Order';
import { stripeService } from '@/server/services/stripe.service';
import Stripe from 'stripe';
import Image from 'next/image';
import { env } from '@/env';

export default async function SignIn() {
  const subscriptionPrice = await stripeService.getPrice(
    env.NEXT_STRIPE_SUBSCRIPTION_PRICE_ID
  );
  const subscriptionProduct = subscriptionPrice.product as Stripe.Product;
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

  return (
    <section>
      <div className="grid md:grid-cols-2">
        <div className="w-full lg:max-w-[512px] py-12 xl:max-w-[640px] 2xl:max-w-[768px] ml-auto px-4 lg:pr-16 xl:pr-24 2xl:pr-32 self-center space-y-8">
          <Order
            features={subscriptionProductDto.marketingFeatures}
            amount={subscriptionProductDto.price.unitAmount}
            interval={subscriptionProductDto.price.interval}
            intervalCount={subscriptionProductDto.price.intervalCount}
            className="col-start-1 col-span-2"
          />
          <RegisterForm className="col-start-1 col-span-2" />
        </div>
        <Image
          className="auth-hero-image object-cover object-bottom w-full hidden md:block"
          src="/auth-hero.png"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
}
