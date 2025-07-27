import "@/app/globals.css";
import MobileNav from "@/components/mobile-nav";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import type React from "react";

export const metadata = {
  title: "Google Photos Clone",
  description: "A Google Photos clone built with Next.js and Tailwind CSS",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
              <MobileNav />
              <Sidebar/>
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
