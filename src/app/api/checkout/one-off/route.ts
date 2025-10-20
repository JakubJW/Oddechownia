import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/server/services/stripe.service.';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { courses } from '@/server/db/schema';
import { createClient } from '@/supabase/server';
import { env } from '@/env';

export async function POST(req: NextRequest) {
  const { courseId } = await req.json();

  if (!courseId) {
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
      { message: 'User must be logged in to perform this action.' },
      { status: 401 }
    );
  }

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  if (!course) {
    return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  }

  if (!course.stripePriceId) {
    return NextResponse.json(
      { message: 'Course does not have associated stripe price id' },
      { status: 422 }
    );
  }

  const session = await stripeService.createCheckoutSession({
    mode: 'payment',
    line_items: [
      {
        price: course.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/sukces?courseId=${course.id}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/anuluj`,
    metadata: {
      courseId: course.id,
      userId: user.id,
    },
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
