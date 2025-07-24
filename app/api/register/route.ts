import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password, role } = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
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
