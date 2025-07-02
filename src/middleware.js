import { NextRequest } from 'next/server'
import { updateSession } from '../supabase/middleware'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Add comprehensive logging to debug middleware execution
  console.log('🔍 Middleware executing for:', request.nextUrl.pathname)
  console.log('🔍 Request method:', request.method)
  console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()))

  try {
    const response = await updateSession(request)
    console.log('✅ Middleware completed successfully for:', request.nextUrl.pathname)
    return response
  } catch (error) {
    console.error('❌ Middleware error for:', request.nextUrl.pathname, error)
    // Return a basic response if middleware fails
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}