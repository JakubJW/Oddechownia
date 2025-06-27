'use server';

import { db } from '@/db';
import {
  coursesToProfiles,
  profiles,
  stripePrices,
  stripeProducts,
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
    case 'product.updated':
      var { id, name, description, active, marketing_features } =
        event.data.object;

      await db
        .insert(stripeProducts)
        .values({
          stripeProductId: id,
          name: createSlug(name),
          description,
          active,
          marketingFeatures: marketing_features,
        })
        .onConflictDoUpdate({
          target: stripeProducts.stripeProductId,
          set: {
            name: createSlug(name),
            description,
            active,
            marketingFeatures: marketing_features,
          },
        });

      revalidatePath('/');
      return NextResponse.json({ message: 'Success' }, { status: 200 });

    case 'price.created':
    case 'price.updated':
      var {
        id: stripePriceId,
        active,
        currency,
        recurring,
        type,
        unit_amount,
        product,
      } = event.data.object;

      if (!recurring) {
        return NextResponse.json({ message: 'Success' }, { status: 200 });
      }

      if (!unit_amount) {
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
        where: eq(stripeProducts.stripeProductId, product as unknown as string),
      });

      if (!existingProduct) {
        console.log('Existing product not found, fetching from Stripe...');

        const {
          id: productId,
          name: productName,
          description: productDescription,
          active: productActive,
          marketing_features: productMarketingFeatures,
        } = await stripeService.getProduct(product as unknown as string);

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
          stripePriceId,
          stripeProductId: product as unknown as string,
          active,
          currency,
          interval: recurring.interval,
          intervalCount: recurring.interval_count,
          type,
          unitAmount: unit_amount,
        })
        .onConflictDoUpdate({
          target: stripeProducts.stripeProductId,
          set: {
            active,
            currency,
            interval: recurring.interval,
            intervalCount: recurring.interval_count,
            type,
            unitAmount: unit_amount,
          },
        });
      return NextResponse.json({ message: 'Success' }, { status: 200 });

    case 'checkout.session.completed':
      const { metadata, mode, client_reference_id, customer } =
        event.data.object;

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

      if (!customer) {
        return NextResponse.json(
          {
            message:
              'Missing customer field in webhook session.checkout.completed event handler',
          },
          { status: 400 }
        );
      }

      if (mode === 'payment') {
        await db.insert(coursesToProfiles).values({
          profileId: metadata.userId,
          courseId: Number(metadata.courseId),
        });
      } else if (mode === 'subscription') {
        await db
          .update(profiles)
          .set({
            subscriptionStatus: 'active',
            stripeCustomerId: customer as unknown as string,
          })
          .where(eq(profiles.id, client_reference_id));
      }

      return NextResponse.json({ message: 'Success' }, { status: 200 });
    default:
      console.error('Webhook type handler not found');
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
