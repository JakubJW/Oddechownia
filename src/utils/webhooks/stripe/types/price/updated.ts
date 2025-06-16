import { db } from '@/db';
import { stripePrices } from '@/db/schema';

type Props = {
  data: { [key: string]: any };
};

// Store only recurring (subscription related) prices. One-off payments related stuff is handled on stripe's side.

const handler = async ({ data }: Props) => {
  const { id, active, currency, recurring, type, unit_amount, product } = data;

  if (type !== 'recurring') return null;

  await db.insert(stripePrices).values({
    stripePriceId: id,
    active,
    currency,
    interval: recurring.interval,
    intervalCount: recurring.interval_count,
    type,
    unitAmount: unit_amount,
    stripeProductId: product,
  });
};

export default handler;
