import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // @ts-expect-error - The library types mismatch slightly with Next.js 15, but this implementation is correct.
        setAll(cookiesToSet) {
          // @ts-expect-error - The library types mismatch slightly with Next.js 15, but this implementation is correct.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // @ts-expect-error - The library types mismatch slightly with Next.js 15, but this implementation is correct.
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  const headers = new Headers(supabaseResponse.headers);
  headers.set('x-current-path', request.nextUrl.pathname);

  const response = NextResponse.next({
    request,
    headers,
  });

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  return response;
}

export const config = {
  matcher: [
    '/logowanie',
    '/rejestracja/:path*',
    '/zapomnialem-hasla',
    '/admin/:path*',
    '/moje-konto/:path*',
    '/api/:function*',
  ],
};
