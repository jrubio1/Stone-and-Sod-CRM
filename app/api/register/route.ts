/**
 * @file app/api/register/route.ts
 * @description This file defines the API route for user registration within the Next.js application.
 *              It acts as a proxy, forwarding registration requests from the frontend to the
 *              backend API and handling the responses.
 */

import { NextResponse } from 'next/server';

/**
 * Handles POST requests to the /api/register endpoint.
 * @param {Request} request - The incoming Next.js request object, containing the registration data.
 * @returns {Promise<NextResponse>} A JSON response indicating the success or failure of the registration.
 */
export async function POST(request: Request) {
  // Extract username, password, and role from the request body.
  const { username, password, role, companyName } = await request.json();

  try {
    // Forward the registration request to the backend API.
    // The URL is constructed using NEXT_PUBLIC_API_URL environment variable.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST', // Specify the HTTP method as POST.
      headers: {
        'Content-Type': 'application/json', // Indicate that the request body is JSON.
      },
      body: JSON.stringify({ username, password, role: 'admin', companyName }), // Send the registration data as a JSON string.
    });

    // Parse the JSON response from the backend API.
    const data = await response.json();

    // Check if the backend API responded with a successful status (2xx).
    if (response.ok) {
      // If successful, return the backend's response with a 200 OK status.
      return NextResponse.json(data, { status: 200 });
    } else {
      // If the backend responded with an error, return its response with the original status code.
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    // Catch any errors that occur during the fetch operation (e.g., network issues, API not reachable).
    console.error('API register proxy error:', error); // Log the error for debugging.
    // Return a generic internal server error response to the frontend.
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
