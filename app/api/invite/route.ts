/**
 * @file app/api/invite/route.ts
 * @description This file defines the API route for inviting new users to a company.
 */

import { NextResponse } from 'next/server';

/**
 * Handles POST requests to the /api/invite endpoint.
 * @param {Request} request - The incoming Next.js request object, containing the invitation data.
 * @returns {Promise<NextResponse>} A JSON response indicating the success or failure of the invitation.
 */
export async function POST(request: Request) {
  const { email, role, companyId } = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role, companyId }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('API user invitation proxy error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
