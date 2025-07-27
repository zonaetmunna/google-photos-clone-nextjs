import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
