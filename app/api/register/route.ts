import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log('Incoming register request body:', requestBody);

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/register`;
    console.log('Fetching API URL:', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      // Assuming the API returns a token upon successful registration
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('API register proxy error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
