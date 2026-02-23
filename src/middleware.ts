import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('admin_session');
    const { pathname } = request.nextUrl;

    // Protect admin dashboard
    if (pathname.startsWith('/admin/dashboard')) {
        if (!session || session.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Redirect to dashboard if already logged in and visiting login page
    if (pathname === '/admin/login') {
        if (session && session.value === 'authenticated') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
