import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
  '/', '/about', '/faq', '/contact', '/privacy',
  '/products', '/products/(.*)',
  '/testimonials', '/top-selling',
  '/api/(.*)',
];

const authRoutes = [
  '/sign-in', '/sign-in/(.*)',
  '/sign-up', '/sign-up/(.*)',
  '/sso-callback', '/sso-callback/(.*)',
];

const isPublicRoute = (pathname: string) => createRouteMatcher(publicRoutes)({ nextUrl: { pathname } } as NextRequest);
const isAuthRoute = (pathname: string) => createRouteMatcher(authRoutes)({ nextUrl: { pathname } } as NextRequest);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const { userId } = await auth();

  // Allow public routes and static files
  if (pathname.includes('.') || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect signed-in users away from auth routes
  if (isAuthRoute(pathname) && userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect unauthenticated users to sign-in
  if (!userId && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
