"use client"

import { ArrowLeft, Star, Grid, Calendar, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PhotoGrid from "@/components/photo-grid"
import { Skeleton } from "@/components/ui/skeleton"

// Sample photo data
const allPhotos = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  src: `/placeholder.svg?height=${300 + (i % 3) * 50}&width=${400 + (i % 5) * 50}`,
  alt: `Photo ${i + 1}`,
  date: new Date(2023, Math.floor(i / 10), (i % 28) + 1).toISOString(),
  favorite: i % 7 === 0,
  location:
    i % 5 === 0
      ? "Mountain View, CA"
      : i % 5 === 1
        ? "San Francisco, CA"
        : i % 5 === 2
          ? "New York, NY"
          : i % 5 === 3
            ? "Seattle, WA"
            : "Chicago, IL",
}))

export default function FavoritesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<typeof allPhotos>([])

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading delay
    const timer = setTimeout(() => {
      const favoritePhotos = allPhotos.filter((photo) => photo.favorite)
      setFavorites(favoritePhotos)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Favorites</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <Tabs defaultValue="grid">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                <span className="text-lg font-medium">
                  {isLoading ? "Loading..." : `${favorites.length} favorites`}
                </span>
              </div>
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="date">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              ) : favorites.length > 0 ? (
                <PhotoGrid photos={favorites} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">No favorites yet</h3>
                  <p className="mb-4 text-center text-muted-foreground">
                    Add photos to your favorites by clicking the star icon
                  </p>
                  <Button asChild>
                    <Link href="/">Browse photos</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="date" className="mt-0">
              {isLoading ? (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-8 w-32" />
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Skeleton key={j} className="aspect-square rounded-md" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : favorites.length > 0 ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">June 2023</h2>
                    <PhotoGrid photos={favorites.slice(0, 5)} />
                  </div>
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">May 2023</h2>
                    <PhotoGrid photos={favorites.slice(5)} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">No favorites yet</h3>
                  <p className="mb-4 text-center text-muted-foreground">
                    Add photos to your favorites by clicking the star icon
                  </p>
                  <Button asChild>
                    <Link href="/">Browse photos</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
