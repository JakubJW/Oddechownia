import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/server/actions/auth';
import { registerFormSchema } from '@/features/Register/Form/schema';
import { AppError, ConflictError } from '@/server/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawData = Object.fromEntries(formData);

    const parsed = registerFormSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Błąd walidacji formularza.' },
        { status: 400 }
      );
    }

    const url = await signUp(parsed.data);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    if (error instanceof ConflictError || error instanceof AppError) {
      return NextResponse.json(
        { message: error.userMessage },
        { status: error.status }
      );
    } else {
      return NextResponse.json({ message: 'Błąd.' }, { status: 500 });
    }
  }
}
