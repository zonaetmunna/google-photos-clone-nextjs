import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAlbumById, getPhotosByAlbumId } from "@/data/data";
import {
  ArrowLeft,
  Calendar,
  Grid,
  MoreHorizontal,
  Plus,
  Share,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function AlbumPage({ params }: { params: { id: string } }) {
  const albumId = Number.parseInt(params.id);
  
  // Get album data dynamically
  const album = getAlbumById(albumId);
  
  // If album doesn't exist, show 404
  if (!album) {
    notFound();
  }
  
  // Get photos for this album
  const photos = getPhotosByAlbumId(albumId);

  return (
    <div className="flex h-screen flex-col w-full">
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
              <DropdownMenuItem className="text-destructive">
                Delete album
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-6">
            <p className="text-muted-foreground">{album.description}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {album.count} items • Created {new Date(album.createdDate).toLocaleDateString()}
            </p>
            {album.isShared && (
              <p className="text-sm text-blue-600 mt-1">
                Shared with {album.sharedWith.length} people
              </p>
            )}
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

          {/* Empty state */}
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 p-4 bg-muted rounded-full">
                <Grid className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No photos in this album</h3>
              <p className="text-muted-foreground mb-4">
                Add some photos to get started
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add photos
              </Button>
            </div>
          ) : (
            /* Photos grid */
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
                  {photo.favorite && (
                    <div className="absolute top-2 right-2 text-yellow-400">
                      <svg
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}