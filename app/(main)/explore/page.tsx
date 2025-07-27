"use client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories, memories, Photo, searchPhotos } from "@/data/data";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Photo[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchPhotos(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="flex h-screen flex-col w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-xl font-semibold">Explore</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search photos, locations, tags..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Search Results ({searchResults?.length})
              </h2>
              {searchResults?.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {searchResults?.slice(0, 24).map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square overflow-hidden rounded-md border"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No photos found for "{searchQuery}"</p>
                  <p className="text-sm mt-2">
                    Try searching for locations, tags, or camera models
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tabs - only show when not searching */}
          {!searchQuery && (
            <Tabs defaultValue="categories">
              <TabsList className="mb-4">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="memories">Memories</TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="mt-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/explore/categories/${category.id}`}
                      className="group overflow-hidden rounded-md border hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={category.cover}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-0 p-3 text-white">
                          <h3 className="font-medium text-sm">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.photoIds.length} photos
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="memories" className="mt-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {memories.map((memory) => (
                    <Link
                      key={memory.id}
                      href={`/explore/memories/${memory.id}`}
                      className="group overflow-hidden rounded-md border hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={memory.cover}
                          alt={memory.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 p-4 text-white">
                          <div className="mb-1">
                            <span className="inline-block px-2 py-1 text-xs bg-white/20 rounded-full capitalize">
                              {memory.type}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium">
                            {memory.title}
                          </h3>
                          <p className="text-sm opacity-90">
                            {memory.description}
                          </p>
                          <p className="text-xs opacity-75 mt-1">
                            {memory.photoIds.length} photos •{" "}
                            {new Date(memory.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
