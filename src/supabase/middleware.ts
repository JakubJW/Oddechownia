import { UserRoles } from '@/db/consts';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '../../env';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const { pathname }: { pathname: string } = request.nextUrl;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authRoutes = ['/logowanie', '/rejestracja', '/zapomnialem-hasla'];
  const RedirectToDashboard = () => {
    if (user?.user_metadata.role == UserRoles.ADMIN) {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (user?.user_metadata.role == UserRoles.USER) {
      return NextResponse.redirect(new URL('/moje-konto', request.url));
    }
  };

  const RedirectToLogin = () => {
    return NextResponse.redirect(new URL('/logowanie', request.url));
  };

  if (user && authRoutes.includes(pathname)) {
    return RedirectToDashboard();
  } else if (!user && !authRoutes.includes(pathname)) {
    return RedirectToLogin();
  }

  if (
    pathname.startsWith('/admin') &&
    user?.user_metadata.role !== UserRoles.ADMIN
  ) {
    return RedirectToDashboard();
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
