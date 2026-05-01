import { RegisterForm } from '@/features/Register/Form/register-form';
import Order from '@/features/Register/Order/Order';
import { stripeService } from '@/server/services/stripe.service';
import Stripe from 'stripe';
import Image from 'next/image';
import { env } from '@/env';
import { Metadata } from 'next';
import Container from '@/components/Container/Container';

export const metadata: Metadata = {
  title: 'Rejestracja',
};

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
      <Container className="min-h-screen grid lg:grid-cols-2 lg:gap-16">
        <div className="w-full self-center space-y-8">
          <h1 className="font-sans text-lg xl:text-xl font-light">
            Dołącz do Oddechowni
          </h1>
          <Order
            features={subscriptionProductDto.marketingFeatures}
            amount={subscriptionProductDto.price.unitAmount}
            interval={subscriptionProductDto.price.interval}
            intervalCount={subscriptionProductDto.price.intervalCount}
            className="col-start-1 col-span-2"
          />
          <RegisterForm className="col-start-1 col-span-2" />
        </div>
        <div className="relative hidden md:block">
          <Image
            className="object-cover object-bottom rounded-[32px]"
            src="/auth-hero.png"
            alt="Hero image"
            fill
            priority={true}
          />
        </div>
      </Container>
    </section>
  );
}
