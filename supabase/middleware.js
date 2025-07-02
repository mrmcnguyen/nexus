import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  try {
    const supabase = createServerComponentClient({ cookies: () => request.cookies });

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const { data } = await supabase.auth.getUser();
    const user = data.user;
    const { pathname } = request.nextUrl;

    // Define public routes that don't require authentication
    const publicRoutes = [
      '/login',
      '/auth',
      '/signIn',
      '/signUp',
      '/',
      '/page'
    ];

    // Define protected routes that require authentication
    const protectedRoutes = [
      '/nexusME',
      '/nexusTEAMS',
      '/dashboard'
    ];

    // Check if the current path is a protected route
    console.log('🔍 Supabase middleware - pathname:', pathname);
    console.log('🔍 User authenticated:', !!user);
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    console.log('🔍 Is protected route:', isProtectedRoute);

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated and trying to access a protected route
    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/signIn';
      return NextResponse.redirect(url);
    }

    // If user is authenticated and trying to access login/signup pages, redirect to dashboard
    if (user && (pathname.startsWith('/signIn') || pathname.startsWith('/signUp') || pathname === '/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Return the response with updated cookies
    return NextResponse.next({ request });
  } catch (error) {
    console.error('❌ Supabase middleware error:', error);
    // Return a basic response if middleware fails
    return NextResponse.next({ request });
  }
}