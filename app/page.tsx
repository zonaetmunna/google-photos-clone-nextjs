"use client"

import type React from "react"

import { Search, Upload, Menu, Bell, Settings, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import PhotoGrid from "@/components/photo-grid"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"

// Sample data for photos
const photos = Array.from({ length: 50 }, (_, i) => ({
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

// Group photos by date
const groupPhotosByDate = (photos: typeof photos) => {
  const groups: Record<string, typeof photos> = {}

  photos.forEach((photo) => {
    const date = new Date(photo.date)
    const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    if (!groups[monthYear]) {
      groups[monthYear] = []
    }

    groups[monthYear].push(photo)
  })

  return Object.entries(groups).map(([date, photos]) => ({
    date,
    photos,
  }))
}

// Sample data for albums
const albums = [
  { id: 1, name: "Favorites", count: 42, cover: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Travel", count: 128, cover: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "Family", count: 76, cover: "/placeholder.svg?height=200&width=200" },
  { id: 4, name: "Nature", count: 54, cover: "/placeholder.svg?height=200&width=200" },
  { id: 5, name: "Food", count: 32, cover: "/placeholder.svg?height=200&width=200" },
  { id: 6, name: "Events", count: 89, cover: "/placeholder.svg?height=200&width=200" },
]

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  const photoGroups = groupPhotosByDate(photos)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleSelect = () => {
    if (isSelecting) {
      setSelectedPhotos([])
    }
    setIsSelecting(!isSelecting)
  }

  const togglePhotoSelection = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((photoId) => photoId !== id))
    } else {
      setSelectedPhotos([...selectedPhotos, id])
    }
  }

  const handleAddToAlbum = () => {
    toast({
      title: "Added to album",
      description: `${selectedPhotos.length} photos added to album`,
    })
    setIsSelecting(false)
    setSelectedPhotos([])
  }

  const handleDelete = () => {
    toast({
      title: "Photos moved to trash",
      description: `${selectedPhotos.length} photos moved to trash`,
    })
    setIsSelecting(false)
    setSelectedPhotos([])
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded" />
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
          <Button variant="ghost" size="icon" className="md:hidden" onClick={handleSearch}>
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
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Navigation */}
        <MobileNav isOpen={sidebarOpen && isMobile} onClose={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen && !isMobile} albums={albums} />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <Tabs defaultValue="photos">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="explore">Explore</TabsTrigger>
                  <TabsTrigger value="albums">Albums</TabsTrigger>
                  <TabsTrigger value="sharing">Sharing</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  {isSelecting ? (
                    <>
                      <Button variant="outline" size="sm" onClick={toggleSelect}>
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddToAlbum}
                        disabled={selectedPhotos.length === 0}
                      >
                        Add to album
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDelete} disabled={selectedPhotos.length === 0}>
                        Delete
                      </Button>
                      <span className="text-sm text-muted-foreground">{selectedPhotos.length} selected</span>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={toggleSelect}>
                      Select
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="photos" className="mt-0">
                {photoGroups.map((group) => (
                  <div key={group.date} className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">{group.date}</h2>
                    <PhotoGrid
                      photos={group.photos}
                      isSelecting={isSelecting}
                      selectedPhotos={selectedPhotos}
                      onSelect={togglePhotoSelection}
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="explore" className="mt-0">
                <div className="grid gap-6">
                  <section>
                    <h2 className="mb-4 text-xl font-semibold">Memories</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <Link
                        href="/explore/memories/1"
                        className="group relative aspect-video overflow-hidden rounded-xl"
                      >
                        <Image
                          src="/placeholder.svg?height=300&width=600"
                          alt="This day last year"
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 p-4 text-white">
                          <h3 className="text-lg font-medium">This day last year</h3>
                          <p className="text-sm opacity-90">12 photos</p>
                        </div>
                      </Link>
                      <Link
                        href="/explore/memories/2"
                        className="group relative aspect-video overflow-hidden rounded-xl"
                      >
                        <Image
                          src="/placeholder.svg?height=300&width=600"
                          alt="Summer memories"
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 p-4 text-white">
                          <h3 className="text-lg font-medium">Summer memories</h3>
                          <p className="text-sm opacity-90">48 photos</p>
                        </div>
                      </Link>
                    </div>
                  </section>

                  <section>
                    <h2 className="mb-4 text-xl font-semibold">Categories</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      <Link href="/explore/categories/people" className="group overflow-hidden rounded-md border">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=200&width=200"
                            alt="People"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">People</h3>
                          <p className="text-sm text-muted-foreground">245 items</p>
                        </div>
                      </Link>
                      <Link href="/explore/categories/places" className="group overflow-hidden rounded-md border">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=200&width=200"
                            alt="Places"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">Places</h3>
                          <p className="text-sm text-muted-foreground">128 items</p>
                        </div>
                      </Link>
                      <Link href="/explore/categories/things" className="group overflow-hidden rounded-md border">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=200&width=200"
                            alt="Things"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">Things</h3>
                          <p className="text-sm text-muted-foreground">76 items</p>
                        </div>
                      </Link>
                      <Link href="/explore/categories/animals" className="group overflow-hidden rounded-md border">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=200&width=200"
                            alt="Animals"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">Animals</h3>
                          <p className="text-sm text-muted-foreground">54 items</p>
                        </div>
                      </Link>
                    </div>
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="albums" className="mt-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  <Link
                    href="/albums/create"
                    className="flex aspect-square flex-col items-center justify-center rounded-md border border-dashed p-6"
                  >
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-1 font-medium">Create album</h3>
                    <p className="text-center text-sm text-muted-foreground">Organize your photos</p>
                  </Link>

                  {albums.map((album) => (
                    <Link
                      key={album.id}
                      href={`/albums/${album.id}`}
                      className="group overflow-hidden rounded-md border"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={album.cover || "/placeholder.svg"}
                          alt={album.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{album.name}</h3>
                        <p className="text-sm text-muted-foreground">{album.count} items</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sharing" className="mt-0">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">No shared albums</h3>
                  <p className="mb-4 text-center text-muted-foreground">Share your photos with friends and family</p>
                  <Button asChild>
                    <Link href="/sharing/create">Create shared album</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
