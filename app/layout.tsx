/**
 * @file layout.tsx
 * @description This file defines the Root Layout for the Next.js application.
 *              It wraps all pages and provides a consistent structure, including global styles,
 *              metadata, and a navigation bar.
 */

import './globals.css'; // Import global CSS styles, typically for Tailwind CSS or other global styling.
import Link from 'next/link'; // Next.js Link component for client-side navigation between routes.

/**
 * Metadata for the application.
 * This object defines SEO-related information like title and description for the entire application.
 */
export const metadata = {
  title: 'Stone and Sod CRM', // The title that appears in the browser tab.
  description: 'Lawn Maintenance Business CRM', // A brief description for SEO purposes.
};

/**
 * RootLayout Component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components (pages) that will be rendered within this layout.
 * @returns {JSX.Element} The HTML structure for the root layout of the application.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> {/* Defines the HTML document with English language. */}
      <body>
        <nav> {/* Navigation bar for easy access to key routes. */}
          <Link href="/login">Login</Link> | {/* Link to the login page. */}
          <Link href="/register">Register</Link> | {/* Link to the registration page. */}
          <Link href="/dashboard">Dashboard (Protected)</Link> {/* Link to the protected dashboard page. */}
        </nav>
        {children} {/* This prop renders the current page content. */}
      </body>
    </html>
  );
}
