'use client';

import AuthGuard from '../src/components/auth/AuthGuard';
import { removeAuthToken } from '../src/lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  return (
    <AuthGuard>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your protected dashboard!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </AuthGuard>
  );
}
