import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Get token from cookies
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard']; // Add other protected routes here

  // Redirect to login if trying to access protected route without a token
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow access to login/register pages if already authenticated (optional)
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/register'], // Apply middleware to these paths
};
