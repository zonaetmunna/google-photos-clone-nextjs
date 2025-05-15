"use client"

import type React from "react"

import { SearchIcon, Filter, Grid, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<typeof allPhotos>([])

  useEffect(() => {
    setIsLoading(true)

    // Simulate search delay
    const timer = setTimeout(() => {
      if (query) {
        // Filter photos based on query (location, date, etc.)
        const filtered = allPhotos.filter(
          (photo) =>
            photo.location.toLowerCase().includes(query.toLowerCase()) ||
            photo.alt.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(filtered)
      } else {
        setResults([])
      }
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

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
          <h1 className="text-xl font-semibold">Search</h1>
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
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search your photos"
                className="w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All results</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="things">Things</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-md" />
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Grid className="h-4 w-4" />
                        Grid view
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Calendar className="h-4 w-4" />
                        By date
                      </Button>
                    </div>
                  </div>
                  <PhotoGrid photos={results} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <SearchIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">No results found</h3>
                  <p className="text-center text-muted-foreground">
                    {query ? `We couldn't find any photos matching "${query}"` : "Enter a search term to find photos"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="people" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-xl font-semibold">No people found</h3>
                <p className="text-center text-muted-foreground">We couldn't find any people matching your search</p>
              </div>
            </TabsContent>

            <TabsContent value="places" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-xl font-semibold">No places found</h3>
                <p className="text-center text-muted-foreground">We couldn't find any places matching your search</p>
              </div>
            </TabsContent>

            <TabsContent value="things" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-xl font-semibold">No things found</h3>
                <p className="text-center text-muted-foreground">We couldn't find any things matching your search</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
