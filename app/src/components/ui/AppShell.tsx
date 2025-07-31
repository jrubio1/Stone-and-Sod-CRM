import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* You can add header, sidebar, etc. here later */}
      <main className="flex-grow p-4">
        {children}
      </main>
      {/* You can add footer here later */}
    </div>
  );
};
