/**
 * @file dashboard/page.tsx
 * @description This file defines the Dashboard page, which is a protected route.
 *              It uses the `AuthGuard` component to ensure only authenticated and authorized
 *              users can access its content. It also provides a logout functionality.
 */

'use client'; // Marks this component as a Client Component, enabling the use of hooks like useRouter.

import AuthGuard from '../src/components/auth/AuthGuard'; // Imports the AuthGuard component for route protection.
import { removeAuthToken } from '../src/lib/auth'; // Utility function to remove the authentication token.
import { useRouter } from 'next/navigation'; // Next.js hook for client-side navigation.

/**
 * DashboardPage Component
 * @returns {JSX.Element} The dashboard content, wrapped in an AuthGuard.
 */
export default function DashboardPage() {
  const router = useRouter(); // Initialize the Next.js router for navigation.

  /**
   * Handles the logout action.
   * It removes the authentication token and redirects the user to the login page.
   */
  const handleLogout = () => {
    removeAuthToken(); // Call the utility function to clear the authentication token.
    router.push('/login'); // Redirect the user to the login page.
  };

  return (
    <AuthGuard> {/* Wrap the dashboard content with AuthGuard for protection. */}
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your protected dashboard!</p>
        <button onClick={handleLogout}>Logout</button> {/* Logout button. */}
      </div>
    </AuthGuard>
  );
}