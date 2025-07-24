'use client';

import { useEffect, useState } from 'react';
import { getAuthToken } from './lib/auth';

export default function Page() {
  const [protectedData, setProtectedData] = useState<string | null>(null);

  const fetchProtectedData = async () => {
    const token = getAuthToken();
    if (!token) {
      setProtectedData('Please log in to access protected data.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/protected`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProtectedData(data.message);
      } else {
        setProtectedData(data.message || 'Failed to fetch protected data.');
      }
    } catch (error) {
      console.error('Error fetching protected data:', error);
      setProtectedData('An error occurred while fetching protected data.');
    }
  };

  return (
    <main>
      <h1>Welcome to Stone and Sod CRM!</h1>
      <p>Your multi-tenant lawn maintenance business solution.</p>

      <div style={{ marginTop: '30px' }}>
        <h2>Protected Content</h2>
        <button onClick={fetchProtectedData}>Fetch Protected Data</button>
        {protectedData && <p>{protectedData}</p>}
      </div>
    </main>
  );
}
