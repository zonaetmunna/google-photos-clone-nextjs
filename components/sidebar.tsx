"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { albums } from "@/data/data";
import { useMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  Archive,
  Calendar,
  Clock,
  Grid,
  Info,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 👈 import this

export default function Sidebar() {
  const pathname = usePathname(); // 👈 get current path
  const isMobile = useMobile();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const isOpen = sidebarOpen && !isMobile;
  const onClose = () => setSidebarOpen(false);
  if (!isOpen) return null;

  const navLinks = [
    { label: "Photos", icon: Grid, href: "/" },
    { label: "Explore", icon: Info, href: "/explore" },
    { label: "Sharing", icon: Calendar, href: "/sharing" },
    { label: "Favorites", icon: Star, href: "/favorites" },
    { label: "Albums", icon: Grid, href: "/albums" },
    { label: "Archive", icon: Archive, href: "/archive" },
    { label: "Utilities", icon: Clock, href: "/utilities" },
    { label: "Trash", icon: Trash2, href: "/trash" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r">
      <ScrollArea className="h-full">
        <div className="p-4">
          <Button
            variant="outline"
            asChild
            className="mb-4 w-full justify-start gap-2"
          >
            <Link href="/upload">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          </Button>

          {/* Nav links */}
          <nav className="grid gap-1">
            {navLinks.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Albums */}
          <div className="mt-6">
            <h3 className="mb-2 px-3 text-sm font-semibold">Albums</h3>
            <nav className="grid gap-1">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/albums/${album.id}`}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Image
                    src={album.cover || "/placeholder.svg"}
                    alt={album.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded"
                  />
                  {album.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {album.count}
                  </span>
                </Link>
              ))}

              <Link
                href="/albums/create"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-muted">
                  +
                </div>
                Create new album
              </Link>
            </nav>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
