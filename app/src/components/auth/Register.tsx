/**
 * @file Register.tsx
 * @description Client-side component for user registration functionality.
 *              It handles user input for username, password, and role, sends registration requests
 *              to the backend API, and redirects the user upon successful registration.
 */

'use client'; // Marks this component as a Client Component, enabling the use of hooks like useState.

import { useState } from 'react'; // React hook for managing component local state.
import { setAuthToken } from '../../lib/auth'; // Utility function (though not directly used for token storage on registration, it's part of the auth library).

/**
 * Register Component
 * @returns {JSX.Element} The registration form and associated UI.
 */
export default function Register() {
  // State variables to store username, password, role, and messages for user feedback.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'.
  const [message, setMessage] = useState('');

  /**
   * Handles the form submission for user registration.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload).
    setMessage(''); // Clear any previous messages.

    try {
      // Send a POST request to the Next.js API route for registration.
      // The Next.js API route will then proxy this request to the actual backend API.
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify that the request body is JSON.
        },
        body: JSON.stringify({ username, password, role }), // Send username, password, and role as JSON.
      });

      // Parse the JSON response from the API.
      const data = await response.json();

      // Check if the registration request was successful (HTTP status 2xx).
      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...'); // Display a success message.
        // Redirect the user to the login page after successful registration.
        window.location.href = '/login';
      } else {
        // If registration failed, display the error message from the API or a generic one.
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      // Catch and log any network or unexpected errors during the fetch operation.
      console.error('Registration error:', error);
      setMessage('An error occurred during registration.'); // Display a generic error message to the user.
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button> {/* Submit button for the form. */}
      </form>
      {message && <p>{message}</p>} {/* Display messages to the user if available. */}
    </div>
  );
}