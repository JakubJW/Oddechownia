'use server';

import { stripeService } from '@/services/stripe';
import { buffer } from '@/utils/requestBodyBufer';
import WEBHOOK_TYPES from '@/utils/webhooks/stripe/types';
import get from 'lodash.get';
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
      { message: `Webhook error: ${(e as Error).message}` },
      {
        status: 400,
      }
    );
  }

  const WEBHOOK_TYPE_HANDLER = get(WEBHOOK_TYPES, event.type);
  if (!WEBHOOK_TYPE_HANDLER) {
    console.error('Webhook type handler not found');
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }

  try {
    await WEBHOOK_TYPE_HANDLER({ data: event.data.object });
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Webhook Error: ${e.message}`);
      return NextResponse.json(
        { message: `Webhook Error: ${e.message}` },
        { status: 400 }
      );
    }

    console.error('Request error', e);
    return NextResponse.json({ message: 'Request error' }, { status: 500 });
  }
}
