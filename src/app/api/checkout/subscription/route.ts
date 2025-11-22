import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { stripeService } from '@/server/services/stripe.service';

export async function POST(req: NextRequest) {
  const { priceId, customerId, clientReferenceId } = await req.json();

  if (!priceId) {
    return NextResponse.json(
      { message: 'Price ID is missing' },
      { status: 400 }
    );
  }

  const session = await stripeService.createCheckoutSession({
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    success_url: `${env.NEXT_PUBLIC_APP_URL}/rejestracja/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dolacz-do-nas`,
    client_reference_id: clientReferenceId,
    subscription_data: {
      metadata: { userId: clientReferenceId },
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { message: 'Unable to create checkout session' },
      { status: 400 }
    );
  }

  return NextResponse.json({ url: session.url }, { status: 200 });
}
