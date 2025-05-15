import { ArrowLeft, MoreHorizontal, Plus, Share, Grid, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AlbumPage({ params }: { params: { id: string } }) {
  const albumId = Number.parseInt(params.id)

  // Sample album data
  const albums = [
    { id: 1, name: "Favorites", count: 42, description: "Your favorite photos" },
    { id: 2, name: "Travel", count: 128, description: "Photos from your trips" },
    { id: 3, name: "Family", count: 76, description: "Family moments" },
    { id: 4, name: "Nature", count: 54, description: "Beautiful nature shots" },
  ]

  const album = albums.find((a) => a.id === albumId) || albums[0]

  // Sample photos for this album
  const photos = Array.from({ length: album.count > 20 ? 20 : album.count }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=300&width=${i % 3 === 0 ? 400 : i % 3 === 1 ? 300 : 500}`,
    alt: `Photo ${i + 1}`,
    date: new Date(2023, Math.floor(i / 4), (i % 28) + 1).toISOString(),
  }))

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
          <h1 className="text-xl font-semibold">{album.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add photos
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit album</DropdownMenuItem>
              <DropdownMenuItem>Download all</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete album</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-6">
            <p className="text-muted-foreground">{album.description}</p>
            <p className="text-sm text-muted-foreground mt-1">{album.count} items</p>
          </div>

          <div className="flex items-center justify-between mb-4">
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
            <Button variant="outline" size="sm">
              Select
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {photos.map((photo) => (
              <Link
                key={photo.id}
                href={`/photos/${photo.id}`}
                className="group relative aspect-square overflow-hidden rounded-md"
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
