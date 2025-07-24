/**
 * @file page.tsx
 * @description This file defines the main landing page of the Next.js application.
 *              It demonstrates fetching protected data from the API, showcasing
 *              the integration of authentication and authorization.
 */

'use client'; // Marks this component as a Client Component, enabling the use of hooks like useState and useEffect.

import { useEffect, useState } from 'react'; // React hooks for side effects and state management.
import { getAuthToken } from './lib/auth'; // Utility function to retrieve the authentication token from cookies.

/**
 * Main Page Component
 * @returns {JSX.Element} The main page content with a protected data fetching example.
 */
export default function Page() {
  // State variable to store the protected data fetched from the API.
  const [protectedData, setProtectedData] = useState<string | null>(null);

  /**
   * Asynchronously fetches protected data from the API.
   * It retrieves the authentication token and includes it in the request headers.
   * Displays the fetched data or an error message.
   */
  const fetchProtectedData = async () => {
    const token = getAuthToken(); // Get the authentication token.

    // If no token is found, inform the user to log in.
    if (!token) {
      setProtectedData('Please log in to access protected data.');
      return;
    }

    try {
      // Make a GET request to the protected API endpoint.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/protected`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header.
        },
      });

      // Parse the JSON response from the API.
      const data = await response.json();

      // If the response is successful, set the protected data.
      if (response.ok) {
        setProtectedData(data.message);
      } else {
        // If there's an error, display the error message from the API or a generic one.
        setProtectedData(data.message || 'Failed to fetch protected data.');
      }
    } catch (error) {
      // Catch and log any network or unexpected errors during the fetch operation.
      console.error('Error fetching protected data:', error);
      setProtectedData('An error occurred while fetching protected data.'); // Display a generic error message.
    }
  };

  return (
    <main>
      <h1>Welcome to Stone and Sod CRM!</h1>
      <p>Your multi-tenant lawn maintenance business solution.</p>

      <div style={{ marginTop: '30px' }}>
        <h2>Protected Content</h2>
        <button onClick={fetchProtectedData}>Fetch Protected Data</button> {/* Button to trigger fetching protected data. */}
        {protectedData && <p>{protectedData}</p>} {/* Display the protected data or message. */}
      </div>
    </main>
  );
}