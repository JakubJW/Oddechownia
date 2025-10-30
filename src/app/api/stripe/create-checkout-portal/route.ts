import { stripeService } from '@/server/services/stripe.service';
import { NextResponse, NextRequest } from 'next/server';
import { env } from '@/env';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const customerId = formData.get('customerId');
    if (!customerId) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 });
    }

    const url = await stripeService.createPortalSession({
      customer: customerId as string,
      return_url: env.NEXT_PUBLIC_APP_URL,
    });

    return NextResponse.redirect(url, {
      status: 303,
    });
  } catch (error) {
    console.log(
      'Podczas zmiany pozycji playlisty wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return NextResponse.json(
      {
        message:
          'Podczas zmiany pozycji playlisty wystąpił błąd. Spróbuj ponownie później.',
      },
      { status: 500 }
    );
  }
}
