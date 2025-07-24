import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Stone and Sod CRM',
  description: 'Lawn Maintenance Business CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/login">Login</Link> |
          <Link href="/register">Register</Link> |
          <Link href="/dashboard">Dashboard (Protected)</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}