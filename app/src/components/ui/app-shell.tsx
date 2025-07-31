'use client';

import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Customers", href: "/customers" },
  { name: "Team", href: "/team" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[--bg-base] text-[--text-primary]">
      <aside className="hidden md:flex w-64 flex-col border-r border-[--border-muted] bg-[--bg-card] p-4">
        <h1 className="text-xl font-bold mb-6">🌿 LawnCRM</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block p-2 rounded hover:bg-[--accent]/10",
                pathname === item.href && "font-bold text-[--accent]"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}