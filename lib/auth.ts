import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const adminRoutes = ['/admin', '/admin/(.*)'];

const isAdminRoute = (pathname: string) => createRouteMatcher(adminRoutes)({ nextUrl: { pathname } } as NextRequest);

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const { pathname } = req.nextUrl;

    const authResult = await auth();
    const userId = authResult?.userId;

    // Allow static files
    if (pathname.includes('.')) {
        return NextResponse.next();
    }

    // Protect admin routes
    if (isAdminRoute(pathname) && !userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)'],
};
