import { Archive, Grid, Calendar, Info, Star, Clock, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Album {
  id: number
  name: string
  count: number
  cover: string
}

interface SidebarProps {
  isOpen: boolean
  albums: Album[]
}

export default function Sidebar({ isOpen, albums }: SidebarProps) {
  if (!isOpen) return null

  return (
    <aside className="w-64 flex-shrink-0 border-r">
      <ScrollArea className="h-full">
        <div className="p-4">
          <Button variant="outline" asChild className="mb-4 w-full justify-start gap-2">
            <Link href="/upload">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          </Button>
          <nav className="grid gap-1">
            <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-accent">
              <Grid className="h-4 w-4" />
              Photos
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Info className="h-4 w-4" />
              Explore
            </Link>
            <Link
              href="/sharing"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              Sharing
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Star className="h-4 w-4" />
              Favorites
            </Link>
            <Link
              href="/archive"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Archive className="h-4 w-4" />
              Archive
            </Link>
            <Link
              href="/utilities"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Clock className="h-4 w-4" />
              Utilities
            </Link>
            <Link
              href="/trash"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Trash
            </Link>
          </nav>
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
                  <span className="ml-auto text-xs text-muted-foreground">{album.count}</span>
                </Link>
              ))}
              <Link
                href="/albums/create"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-muted">+</div>
                Create new album
              </Link>
            </nav>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
