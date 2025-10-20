'use server';

import { db } from '@/server/db';
import { stripePrices, stripeProducts } from '@/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const getSubscriptions = async () => {
  const result = await db
    .select()
    .from(stripeProducts)
    .innerJoin(
      stripePrices,
      eq(stripePrices.stripeProductId, stripeProducts.stripeProductId)
    )
    .where(
      and(eq(stripePrices.active, true), eq(stripePrices.type, 'recurring'))
    )
    .orderBy(asc(stripePrices.intervalCount));

  // query.stripeProducts.findMany({
  //   with: {
  //     stripePrices: {
  //       where: (stripePrices, { eq, and }) =>
  //         and(
  //           eq(stripePrices.type, 'recurring'),
  //           eq(stripePrices.active, true)
  //         ),
  //       orderBy: (stripePrices, { asc }) => [asc(stripePrices.intervalCount)],
  //     },
  //   },
  // });

  return result.map(({ stripe_products, stripe_prices }) => {
    return { ...stripe_products, stripePrice: stripe_prices };
  });
};

export const getSubscriptionBySlug = async (slug: string) => {
  const result = await db.query.stripeProducts.findFirst({
    with: {
      stripePrices: {
        where: (stripePrices, { eq, and }) =>
          and(
            eq(stripePrices.type, 'recurring'),
            eq(stripePrices.active, true)
          ),
      },
    },
    where: (stripeProducts, { eq }) => eq(stripeProducts.name, slug),
  });

  return result;
};
