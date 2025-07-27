"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav() {
  const isMobile = useMobile();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const isOpen = sidebarOpen && isMobile;

  const onClose = () => {
    setSidebarOpen(false);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-[280px]">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-xl font-semibold">Photos</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4">
            <Button
              variant="outline"
              asChild
              className="mb-4 w-full justify-start gap-2"
            >
              <Link href="/upload" onClick={onClose}>
                <Upload className="h-4 w-4" />
                Upload
              </Link>
            </Button>
            <nav className="grid gap-1">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-accent"
                onClick={onClose}
              >
                <Grid className="h-4 w-4" />
                Photos
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onClose}
              >
                <Info className="h-4 w-4" />
                Explore
              </Link>
              <Link
                href="/sharing"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onClose}
              >
                <Calendar className="h-4 w-4" />
                Sharing
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onClose}
              >
                <Star className="h-4 w-4" />
                Favorites
              </Link>
              <Link
                href="/archive"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onClose}
              >
                <Archive className="h-4 w-4" />
                Archive
              </Link>
              <Link
                href="/utilities"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onClose}
              >
                <Clock className="h-4 w-4" />
                Utilities
              </Link>
              <Link
                href="/trash"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onClose}
              >
                <Trash2 className="h-4 w-4" />
                Trash
              </Link>
            </nav>
            <div className="mt-6">
              <h3 className="mb-2 px-3 text-sm font-semibold">Albums</h3>
              <nav className="grid gap-1">
                <Link
                  href="/albums/1"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={onClose}
                >
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Favorites"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded"
                  />
                  Favorites
                  <span className="ml-auto text-xs text-muted-foreground">
                    42
                  </span>
                </Link>
                <Link
                  href="/albums/2"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={onClose}
                >
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Travel"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded"
                  />
                  Travel
                  <span className="ml-auto text-xs text-muted-foreground">
                    128
                  </span>
                </Link>
                <Link
                  href="/albums/create"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={onClose}
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
      </SheetContent>
    </Sheet>
  );
}
