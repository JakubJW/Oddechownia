import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { stripeProducts } from '@/db/schema';
import { env } from '@/env';
import { stripeService } from '@/services/stripe';

export async function POST(req: NextRequest) {
  const { stripeProductId, customerEmail, clientReferenceId } =
    await req.json();

  if (!stripeProductId) {
    return NextResponse.json(
      { message: 'Product ID missing' },
      { status: 400 }
    );
  }

  if (!customerEmail) {
    return NextResponse.json(
      { message: 'Customer email missing' },
      { status: 400 }
    );
  }

  const stripePoduct = await db.query.stripeProducts.findFirst({
    where: eq(stripeProducts.stripeProductId, stripeProductId),
    with: {
      stripePrices: true,
    },
  });

  if (!stripePoduct) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  if (!stripePoduct.stripePrices) {
    return NextResponse.json(
      { message: 'Product  does not have associated stripe price id' },
      { status: 422 }
    );
  }

  const session = await stripeService.createCheckoutSession({
    mode: 'subscription',
    line_items: [
      {
        price: stripePoduct.stripePrices[0].stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/moje-konto`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dolacz-do-nas`,
    customer_email: customerEmail,
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
