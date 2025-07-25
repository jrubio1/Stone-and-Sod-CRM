/**
 * @file AcceptInvite.tsx
 * @description Client-side component for accepting user invitations.
 *              It allows invited users to set their password using a token
 *              and completes their registration.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AcceptInvite() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No invitation token found.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('No invitation token found.');
      return;
    }

    try {
      const response = await fetch('/api/accept-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Invitation accepted! You can now log in.');
        // Optionally redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.message || 'Failed to accept invitation.');
      }
    } catch (err) {
      console.error('Accept invitation error:', err);
      setError('An error occurred while accepting the invitation.');
    }
  };

  if (error && error !== 'No invitation token found.') {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!token) {
    return <p>Invalid invitation link. Please ensure you have the correct token.</p>;
  }

  return (
    <div>
      <h2>Accept Invitation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Set Your Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Accept Invitation</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
