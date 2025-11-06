'use server';

import { db } from '@/server/db';
import { userSubscription } from '@/server/db/schema';
import { stripeService } from '@/server/services/stripe.service';
import { buffer } from '@/utils/requestBodyBufer';
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
    case 'checkout.session.completed': {
      const { mode } = event.data.object;

      if (mode !== 'subscription') {
        return NextResponse.json(
          { message: 'Unhandled session mode.' },
          { status: 400 }
        );
      }

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

      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const { status, id, metadata } = event.data.object;

      await db
        .insert(userSubscription)
        .values({
          status: status,
          stripeSubscriptionId: id,
          userId: metadata.userId,
        })
        .onConflictDoUpdate({
          target: userSubscription.stripeSubscriptionId,
          set: {
            status: status,
            userId: metadata.userId,
          },
        });

      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    default:
      console.error('Webhook type handler not found');
      return NextResponse.json(
        { message: 'Webhook type handler not found' },
        { status: 500 }
      );
  }
}
