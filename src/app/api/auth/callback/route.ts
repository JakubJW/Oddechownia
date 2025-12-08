import { env } from '@/env';
import { createClient } from '@/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}${next}`);
    }
  }

  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error`
  );
}
