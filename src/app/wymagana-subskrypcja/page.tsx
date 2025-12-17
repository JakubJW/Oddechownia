import { SubscriptionRequiredCard } from '@/features/subscription-required-card';
import Image from 'next/image';
import { env } from '@/env';
import { getRequiredUser } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex,nofollow',
};

const SubscriptionRequired = async () => {
  const user = await getRequiredUser();

  return (
    <section>
      <div className="grid lg:grid-cols-2">
        <SubscriptionRequiredCard
          user={user}
          subscriptionPriceId={env.NEXT_STRIPE_SUBSCRIPTION_PRICE_ID}
        />
        <Image
          className="auth-hero-image object-cover object-bottom w-full hidden lg:block"
          src="/hero2.jpg"
          alt="Hero image"
          height={3088}
          width={2048}
          priority={true}
        />
      </div>
    </section>
  );
};

export default SubscriptionRequired;
