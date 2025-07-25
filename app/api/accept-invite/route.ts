/**
 * @file app/api/accept-invite/route.ts
 * @description This file defines the API route for accepting user invitations.
 *              It acts as a proxy, forwarding the invitation acceptance request
 *              from the frontend to the backend API and handling the responses.
 */

import { NextResponse } from 'next/server';

/**
 * Handles POST requests to the /api/accept-invite endpoint.
 * @param {Request} request - The incoming Next.js request object, containing the invitation token and new password.
 * @returns {Promise<NextResponse>} A JSON response indicating the success or failure of the invitation acceptance.
 */
export async function POST(request: Request) {
  const { token, password } = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accept-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('API accept invite proxy error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
