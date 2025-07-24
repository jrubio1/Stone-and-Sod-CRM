/**
 * @file Login.tsx
 * @description Client-side component for user login functionality.
 *              It handles user input for username and password, sends authentication requests
 *              to the backend API, and manages the authentication token upon successful login.
 */

'use client'; // Marks this component as a Client Component, enabling the use of hooks like useState.

import { useState } from 'react'; // React hook for managing component local state.
import { setAuthToken } from '../../lib/auth'; // Utility function to store the authentication token in cookies.

/**
 * Login Component
 * @returns {JSX.Element} The login form and associated UI.
 */
export default function Login() {
  // State variables to store username, password, and messages for user feedback.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  /**
   * Handles the form submission for user login.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload).
    setMessage(''); // Clear any previous messages.

    try {
      // Send a POST request to the Next.js API route for login.
      // The Next.js API route will then proxy this request to the actual backend API.
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify that the request body is JSON.
        },
        body: JSON.stringify({ username, password }), // Send username and password as JSON.
      });

      // Parse the JSON response from the API.
      const data = await response.json();

      // Check if the login request was successful (HTTP status 2xx).
      if (response.ok) {
        setAuthToken(data.token); // Store the received authentication token.
        setMessage('Login successful!'); // Display a success message.
        // Redirect the user to the dashboard page after successful login.
        window.location.href = '/dashboard';
      } else {
        // If login failed, display the error message from the API or a generic one.
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      // Catch and log any network or unexpected errors during the fetch operation.
      console.error('Login error:', error);
      setMessage('An error occurred during login.'); // Display a generic error message to the user.
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}> {/* Attach the handleSubmit function to the form's onSubmit event. */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on input change.
            required // Mark username as a required field.
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change.
            required // Mark password as a required field.
          />
        </div>
        <button type="submit">Login</button> {/* Submit button for the form. */}
      </form>
      {message && <p>{message}</p>} {/* Display messages to the user if available. */}
    </div>
  );
}