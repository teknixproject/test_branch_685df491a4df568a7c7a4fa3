// import { NextResponse } from 'next/server';

// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const headers = new Headers(request.headers);
//   headers.set('x-path-name', request.nextUrl.pathname);
//   return NextResponse.next({ headers });
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

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
