import { stripeService } from '@/server/services/stripe.service.';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = await stripeService.createPortalSession({
      customer: body.customerId,
      return_url: 'http://localhost:3000',
    });

    return NextResponse.redirect(url, { status: 303 });
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
