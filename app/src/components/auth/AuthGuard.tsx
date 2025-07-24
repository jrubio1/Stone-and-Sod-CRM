'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '../../lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login'); // Redirect to login if no token
      return;
    }

    // Decode JWT to get user role (this is a simplified example, in a real app
    // you'd want to verify the token on the server or use a library like jwt-decode)
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      setUserRole(decoded.role);

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        router.push('/unauthorized'); // Redirect if role not allowed
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
    }
  }, [router, allowedRoles]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default AuthGuard;
