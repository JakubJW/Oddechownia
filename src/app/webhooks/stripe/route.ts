'use server';

import { db } from '@/server/db';
import { subscriptions } from '@/server/db/schema';
import { EbookPurchaseStrategy } from '@/infrastructure/strategies/ebook-purchase.strategy';
import { LiveLessonPurchaseStrategy } from '@/infrastructure/strategies/live-lesson-purchase.strategy';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { AuthService } from '@/server/services/auth.service';
import { stripeService } from '@/server/services/stripe.service';
import { FulfillPurchaseUseCase } from '@/application/use-cases/purchase/fulfill-purchase.use-case';
import { buffer } from '@/utils/requestBodyBufer';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';

const ebookStrategy = new EbookPurchaseStrategy();
const purchasesRepository = new PurchasesRepository();

const liveLessonStrategy = new LiveLessonPurchaseStrategy(
  new LiveLessonsRepository(),
  purchasesRepository
);

const fulfillPurchaseUseCase = new FulfillPurchaseUseCase(purchasesRepository, [
  ebookStrategy,
  liveLessonStrategy,
]);

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
      const { mode, id, payment_status, metadata, customer_details } =
        event.data.object;

      if (mode === 'payment') {
        try {
          await fulfillPurchaseUseCase.execute({
            userEmail: customer_details!.email!,
            checkoutSessionId: id,
            stripePaymentStatus: payment_status,
            metadata: metadata || {},
          });

          return NextResponse.json(
            { message: 'Payment processed successfully' },
            { status: 200 }
          );
        } catch (error) {
          console.error(error);
          return NextResponse.json({ message: 'Bad request' }, { status: 400 });
        }
      }

      if (mode === 'subscription') {
        try {
          await AuthService.fulfillSubscriptionPurchase(id, {
            sendEmail: true,
          });
          return NextResponse.json({ message: 'Success' }, { status: 200 });
        } catch (error) {
          console.error(error);
          return NextResponse.json({ message: 'Bad request' }, { status: 400 });
        }
      }
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const { status, items, cancel_at_period_end, id } = event.data
        .object as Stripe.Subscription;

      await db
        .update(subscriptions)
        .set({
          status: status,
          currentPeriodStart: new Date(
            items.data[0].current_period_start * 1000
          ).toISOString(),
          currentPeriodEnd: new Date(
            items.data[0].current_period_end * 1000
          ).toISOString(),
          cancelAtPeriodEnd: cancel_at_period_end,
        })
        .where(eq(subscriptions.stripeSubscriptionId, id));

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
