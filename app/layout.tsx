/**
 * @file layout.tsx
 * @description This file defines the Root Layout for the Next.js application.
 *              It wraps all pages and provides a consistent structure, including global styles,
 *              metadata, and a navigation bar.
 */

import './globals.css'; // Import global CSS styles, typically for Tailwind CSS or other global styling.
import Navbar from './src/components/layout/Navbar';

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
        <Navbar />
        {children}
      </body>
    </html>
  );
}