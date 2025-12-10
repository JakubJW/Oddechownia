import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordResetFormSchema } from '@/features/zapomnialem-hasla/requestResetPasswordFormSchema';
import { requestPasswordReset } from '@/server/actions/auth';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const parsed = requestPasswordResetFormSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json('Błąd walidacji danych.', { status: 400 });
    }

    await requestPasswordReset(parsed.data.email);

    return NextResponse.json(
      {
        message:
          'Jeśli adres e-mail znajduje się w naszej bazie danych, otrzymasz na niego wiadomość z likniem do zresetowania hasła.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Podczas żądania zmiany hasła wystąpił błąd',
      },
      { status: 500 }
    );
  }
}
