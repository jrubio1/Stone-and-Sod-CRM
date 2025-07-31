import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'sonner';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { AppShell } from "@/components/ui/AppShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors position="top-right" />
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <AppShell>{children}</AppShell>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}