import RegisterForm from '@/features/Register/Form/RegisterForm';
import Order from '@/features/Register/Order/Order';
import { stripeService } from '@/server/services/stripe.service';
import Stripe from 'stripe';
import Image from 'next/image';

export default async function SignIn() {
  const product = await stripeService.getProduct('prod_Swifo6V6uVtRlK');

  const price = product.default_price as Stripe.Price;

  const subscriptionProductDto = {
    marketingFeatures: product.marketing_features.map(({ name }) => name),
    price: {
      id: price.id,
      unitAmount: price.unit_amount || 0,
      interval: price.recurring?.interval,
      intervalCount: price.recurring?.interval_count,
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
          <RegisterForm
            priceId={subscriptionProductDto.price.id}
            className="col-start-1 col-span-2"
          />
        </div>
        <Image
          className="homepage-hero-image object-cover object-bottom w-full hidden md:block"
          src="https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/website-assets/images/hero.png"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
}
