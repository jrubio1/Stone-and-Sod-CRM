/**
 * @file Navbar.tsx
 * @description Client-side navigation bar component that conditionally renders links
 *              based on user authentication status.
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAuthToken } from '../../lib/auth'; // Assuming this function checks for a valid token

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status (e.g., by checking for a token)
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav>
      <Link href="/login">Login</Link> | {/* Always visible */}
      {!isLoggedIn && (
        <>
          <Link href="/register">Register Company</Link> | {/* Only visible when not logged in */}
          <Link href="/accept-invite">Accept Invite</Link> | {/* Only visible when not logged in */}
        </>
      )}
      {isLoggedIn && (
        <>
          <Link href="/dashboard">Dashboard</Link> | {/* Only visible when logged in */}
        </>
      )}
    </nav>
  );
}
