"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMobile } from "@/hooks/use-mobile";
import { Bell, Menu, Search, Settings, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const isMobile = useMobile();

  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-xl font-semibold">Photos</span>
        </Link>
      </div>
      <div className="hidden md:flex md:flex-1 md:justify-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your photos"
            className="w-full rounded-full pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/upload">
            <Upload className="h-5 w-5" />
            <span className="sr-only">Upload</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        <Avatar className="h-8 w-8 cursor-pointer" onClick={() => router.push("/profile")}>
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
