import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Create a response
  const response = NextResponse.next();

  // Add the pathname to headers so we can access it in server components
  const pathname = request.nextUrl.pathname;
  response.headers.set('x-path-name', pathname);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
