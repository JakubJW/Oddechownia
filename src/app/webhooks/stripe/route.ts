'use server';

import { db } from '@/db';
import {
  userOneOffPurchase,
  stripePrices,
  stripeProducts,
  userSubscription,
} from '@/db/schema';
import { createSlug } from '@/lib/utils';
import { stripeService } from '@/services/stripe';
import { buffer } from '@/utils/requestBodyBufer';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const text = await req.text();
  const raw = await buffer(text).then((buffer) => buffer.toString('utf8'));

  let event: Stripe.Event;
  const signature = req.headers.get('stripe-signature') as string;

  try {
    event = stripeService.constructWebhookEvent(raw, signature);
  } catch (e) {
    console.error('Webhook signature verification failed', e);
    return NextResponse.json(
      { message: 'Webhook signature verification failed' },
      {
        status: 400,
      }
    );
  }

  switch (event.type) {
    case 'product.created':
    case 'product.updated': {
      const {
        id: productId,
        name: productName,
        description: productDescription,
        active: productActive,
        marketing_features: productMarketingFeatures,
        metadata: productMetadata,
      } = event.data.object;

      if (productMetadata && productMetadata.priceType === 'one-off') {
        return NextResponse.json({ message: 'Success' }, { status: 200 });
      }

      await db
        .insert(stripeProducts)
        .values({
          stripeProductId: productId,
          name: createSlug(productName),
          description: productDescription,
          active: productActive,
          marketingFeatures: productMarketingFeatures,
        })
        .onConflictDoUpdate({
          target: stripeProducts.stripeProductId,
          set: {
            name: createSlug(productName),
            description: productDescription,
            active: productActive,
            marketingFeatures: productMarketingFeatures,
          },
        });

      revalidatePath('/');
      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    case 'price.created':
    case 'price.updated': {
      const {
        id: priceId,
        active: priceActive,
        currency: priceCurrency,
        recurring: priceRecurring,
        type: priceType,
        unit_amount: priceUnitAmount,
        product: priceProductId,
      } = event.data.object;

      if (!priceRecurring) {
        return NextResponse.json({ message: 'Success' }, { status: 200 });
      }

      if (!priceUnitAmount) {
        console.error(
          'Missing unit_amount field in webhook price.created or price.updated event handler'
        );
        return NextResponse.json(
          {
            message:
              'Missing unit_amount field in webhook price.created or price.updated event handler',
          },
          { status: 400 }
        );
      }

      const existingProduct = await db.query.stripeProducts.findFirst({
        where: eq(
          stripeProducts.stripeProductId,
          priceProductId as unknown as string
        ),
      });

      if (!existingProduct) {
        console.log('Existing product not found, fetching from Stripe...');

        const {
          id: productId,
          name: productName,
          description: productDescription,
          active: productActive,
          marketing_features: productMarketingFeatures,
        } = await stripeService.getProduct(priceProductId as unknown as string);

        await db.insert(stripeProducts).values({
          stripeProductId: productId,
          name: createSlug(productName),
          description: productDescription,
          active: productActive,
          marketingFeatures: productMarketingFeatures,
        });
      }

      await db
        .insert(stripePrices)
        .values({
          stripePriceId: priceId,
          stripeProductId: priceProductId as unknown as string,
          active: priceActive,
          currency: priceCurrency,
          interval: priceRecurring.interval,
          intervalCount: priceRecurring.interval_count,
          type: priceType,
          unitAmount: priceUnitAmount,
        })
        .onConflictDoUpdate({
          target: stripeProducts.stripeProductId,
          set: {
            active: priceActive,
            currency: priceCurrency,
            interval: priceRecurring.interval,
            intervalCount: priceRecurring.interval_count,
            type: priceType,
            unitAmount: priceUnitAmount,
          },
        });
      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    case 'checkout.session.completed': {
      const { mode } = event.data.object;

      if (mode === 'payment') {
        const { metadata, payment_intent } = event.data.object;

        if (!metadata) {
          console.error(
            'Missing metadata field in webhook session.checkout.completed event handler'
          );
          return NextResponse.json(
            {
              message:
                'Missing metadata field in webhook session.checkout.completed event handler',
            },
            { status: 400 }
          );
        }

        if (!payment_intent) {
          console.error(
            'Missing payment_intent field in webhook session.checkout.completed event handler'
          );
          return NextResponse.json(
            {
              message:
                'Missing payment_intent field in webhook session.checkout.completed event handler',
            },
            { status: 400 }
          );
        }

        await db.insert(userOneOffPurchase).values({
          userId: metadata.userId,
          courseId: Number(metadata.courseId),
          stripePaymentIntentId: payment_intent as string,
        });
      } else if (mode === 'subscription') {
        const { subscription, client_reference_id } = event.data.object;

        if (!subscription) {
          console.error(
            'Missing subscription field in webhook session.checkout.completed event handler'
          );
          return NextResponse.json(
            {
              message:
                'Missing subscription field in webhook session.checkout.completed event handler',
            },
            { status: 400 }
          );
        }

        if (!client_reference_id) {
          console.error(
            'Missing client_reference_id field in webhook session.checkout.completed event handler'
          );
          return NextResponse.json(
            {
              message:
                'Missing metadata field in webhook session.checkout.completed event handler',
            },
            { status: 400 }
          );
        }

        await db.insert(userSubscription).values({
          userId: client_reference_id,
          stripeSubscriptionId: subscription as string,
        });
      }

      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const { status, id } = event.data.object;

      await db
        .insert(userSubscription)
        .values({
          status: status,
          stripeSubscriptionId: id,
          userId: 'siema',
        })
        .onConflictDoUpdate({
          target: userSubscription.id,
          set: {
            status: status,
            stripeSubscriptionId: id,
          },
        });
    }

    default:
      console.error('Webhook type handler not found');
      return NextResponse.json(
        { message: 'Webhook type handler not found' },
        { status: 500 }
      );
  }
}
