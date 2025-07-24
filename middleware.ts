/**
 * @file middleware.ts
 * @description This file defines the Next.js middleware for handling authentication and authorization.
 *              Middleware functions run before a request is completed, allowing for logic like
 *              redirecting users based on their authentication status or roles.
 */

import { NextResponse } from 'next/server'; // Import NextResponse for redirecting and rewriting responses.
import type { NextRequest } from 'next/server'; // Import NextRequest for type-checking the request object.
import { getAuthToken } from '@/lib/auth'; // Utility function to retrieve the authentication token from cookies.

/**
 * The main middleware function that executes for configured routes.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response object, either redirecting or allowing the request to proceed.
 */
export function middleware(request: NextRequest) {
  // Attempt to get the authentication token from the request cookies.
  const token = request.cookies.get('token')?.value;
  // Extract the pathname from the request URL.
  const { pathname } = request.nextUrl;

  // Define an array of routes that require authentication (protected routes).
  const protectedRoutes = ['/dashboard']; // Add other protected routes here as needed.

  // Logic to redirect to the login page if a user tries to access a protected route without a token.
  if (protectedRoutes.includes(pathname) && !token) {
    // If the route is protected and no token is found, redirect to the /login page.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Logic to redirect authenticated users away from login/register pages.
  // If a user is already authenticated (has a token) and tries to access /login or /register,
  // redirect them to the /dashboard.
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If none of the above conditions are met, allow the request to proceed to its destination.
  return NextResponse.next();
}

/**
 * Configuration object for the middleware.
 * The `matcher` property specifies the paths for which this middleware will be executed.
 * It uses a regex-like syntax to match routes.
 */
export const config = {
  matcher: ['/dashboard', '/login', '/register'], // Apply middleware to /dashboard, /login, and /register paths.
};