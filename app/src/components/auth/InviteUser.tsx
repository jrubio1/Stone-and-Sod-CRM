/**
 * @file app/src/components/auth/InviteUser.tsx
 * @description This file contains the user invitation form component.
 */

'use client';

import { useState, useEffect } from 'react';
import { getAuthToken, decodeToken } from '../../lib/auth';

const InviteUser = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [companyId, setCompanyId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.companyId) {
        setCompanyId(decoded.companyId);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email || !role || !companyId) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ email, role, companyId }),
      });

      if (response.ok) {
        setMessage('Invitation sent successfully!');
        setEmail('');
        setRole('user');
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred while sending invitation');
      }
    } catch (error) {
      setError('An error occurred while sending invitation');
    }
  };

  return (
    <div>
      <h2>Invite New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">User Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {/* Company ID is now automatically populated from the token */}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Send Invitation</button>
      </form>
    </div>
  );
};

export default InviteUser;
