'use server';

import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { AuthService } from '@/server/services/auth.service';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
import { stripeService } from '@/server/services/stripe.service';
import { buffer } from '@/utils/requestBodyBufer';
import { eq } from 'drizzle-orm';
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
      const { mode, id } = event.data.object;

      if (mode === 'payment') {
        try {
          await LiveLessonsRegistrationsService.fullfillLiveLessonPurchase(id);

          return NextResponse.json(
            { message: 'Payment processed successfully' },
            { status: 200 }
          );
        } catch (error) {
          return NextResponse.json({ message: 'Bad request' }, { status: 400 });
        }
      }

      if (mode === 'subscription') {
        try {
          await AuthService.fulfillSubscriptionPurchase(id);
          return NextResponse.json({ message: 'Success' }, { status: 200 });
        } catch (error) {
          return NextResponse.json({ message: 'Bad request' }, { status: 400 });
        }
      }
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const { status, customer } = event.data.object;

      await db
        .update(users)
        .set({
          subscriptionStatus: status,
        })
        .where(eq(users.stripeCustomerId, customer as string));

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
