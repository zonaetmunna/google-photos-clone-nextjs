import MobileNav from "@/components/mobile-nav";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
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
    <div className="flex h-screen flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <MobileNav />
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
