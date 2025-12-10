import { NextRequest, NextResponse } from 'next/server';
import { setNewPasswordFormSchema } from '@/features/zapomnialem-hasla/requestResetPasswordFormSchema';
import { updatePassword } from '@/server/actions/auth';
import { getUser } from '@/server/actions/user';

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json('Aby wykonać tę akcję musisz być zalogowany.', {
        status: 401,
      });
    }

    const raw = await req.formData();
    const body = Object.fromEntries(raw);

    const parsed = setNewPasswordFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json('Błąd walidacji danych.', { status: 400 });
    }

    await updatePassword(parsed.data.password);

    return NextResponse.json(
      {
        message:
          'Hasło zostało zmienione. Zaloguj sie przy użyciu nowego hasła.',
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
