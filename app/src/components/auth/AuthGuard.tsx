/**
 * @file AuthGuard.tsx
 * @description A client-side React component that acts as an authentication and authorization guard.
 *              It checks for the presence of an authentication token and, if provided, decodes it
 *              to verify the user's role. It redirects users to the login page if unauthenticated
 *              or to an unauthorized page if they don't have the necessary permissions.
 */

'use client'; // Marks this component as a Client Component, enabling the use of hooks like useRouter, useEffect, and useState.

import { useEffect, useState } from 'react'; // React hooks for side effects and state management.
import { useRouter } from 'next/navigation'; // Next.js hook for client-side navigation.
import { getAuthToken } from '../../lib/auth'; // Utility function to retrieve the authentication token from cookies.

/**
 * @interface AuthGuardProps
 * @property {React.ReactNode} children - The child components that the AuthGuard will protect.
 * @property {string[]} [allowedRoles] - An optional array of roles that are allowed to access the protected content.
 *                                      If provided, the user's role must be in this array.
 */
interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * AuthGuard Component
 * @param {AuthGuardProps} props - The props for the AuthGuard component.
 * @returns {JSX.Element | null} The protected child components if authenticated and authorized, otherwise null (or a loading indicator).
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter(); // Initialize the Next.js router for navigation.
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track user authentication status.
  const [userRole, setUserRole] = useState<string | null>(null); // State to store the authenticated user's role.

  // useEffect hook to perform authentication checks when the component mounts or dependencies change.
  useEffect(() => {
    const token = getAuthToken(); // Attempt to retrieve the authentication token.

    // If no token is found, redirect the user to the login page.
    if (!token) {
      router.push('/login');
      return;
    }

    // Attempt to decode the JWT to extract user information, including the role.
    // NOTE: In a production application, JWT verification should primarily happen on the server-side
    // to prevent client-side tampering. This client-side decoding is for basic UI logic.
    try {
      // JWTs consist of three parts separated by dots: Header.Payload.Signature.
      // We are interested in the Payload, which is base64Url encoded.
      const base64Url = token.split('.')[1];
      // Convert base64Url to base64 by replacing URL-safe characters.
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Decode the base64 string and parse the JSON payload.
      const decoded = JSON.parse(atob(base64));
      setUserRole(decoded.role); // Set the user's role from the decoded token.

      // If allowedRoles are specified, check if the user's role is included.
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        // If the user's role is not allowed, redirect to the unauthorized page.
        router.push('/unauthorized');
      } else {
        // If authenticated and authorized, set isAuthenticated to true to render children.
        setIsAuthenticated(true);
      }
    } catch (error) {
      // If there's an error decoding the token (e.g., malformed or invalid),
      // log the error and redirect the user to the login page.
      console.error('Error decoding token:', error);
      router.push('/login');
    }
  }, [router, allowedRoles]); // Dependencies: router and allowedRoles to re-run effect if they change.

  // If not yet authenticated, render nothing (or a loading spinner) to prevent flickering.
  if (!isAuthenticated) {
    return null; // Or a loading spinner component.
  }

  // If authenticated and authorized, render the child components.
  return <>{children}</>;
};

export default AuthGuard;