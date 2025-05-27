import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/stripe/stripe';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { stripeProducts } from '@/db/schema';
import { createClient } from '@/supabase/server';
import { env } from '@/../env';

export async function POST(req: NextRequest) {
  const { stripeProductId } = await req.json();

  if (!stripeProductId) {
    return NextResponse.json(
      { message: 'Product ID missing' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: 'User must be logged in to perform this action' },
      { status: 401 }
    );
  }

  const stripePoduct = await db.query.stripeProducts.findFirst({
    where: eq(stripeProducts.stripeProductId, stripeProductId),
    with: {
      stripePrice: true,
    },
  });

  if (!stripePoduct) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  if (!stripePoduct.stripePrice) {
    return NextResponse.json(
      { message: 'Product  does not have associated stripe price id' },
      { status: 422 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: stripePoduct.stripePrice.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/sukces?courseId=${stripePoduct.stripeProductId}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/anuluj`,
    metadata: {
      courseId: stripePoduct.stripeProductId,
      userId: user.id,
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
