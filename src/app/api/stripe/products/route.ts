import { stripeService } from '@/server/services/stripe.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await stripeService.listProducts();

    return NextResponse.json(result, {
      status: 200,
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
