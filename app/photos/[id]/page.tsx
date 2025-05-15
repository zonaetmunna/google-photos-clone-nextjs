"use client"

import { ArrowLeft, Download, Share, Edit, Info, ChevronLeft, ChevronRight, Star, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample photo data
const allPhotos = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  src: `/placeholder.svg?height=${300 + (i % 3) * 50}&width=${400 + (i % 5) * 50}`,
  alt: `Photo ${i + 1}`,
  date: new Date(2023, Math.floor(i / 10), (i % 28) + 1).toLocaleDateString(),
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
  camera: "Google Pixel 6",
  size: "3.2 MB",
  resolution: "4000 x 3000",
  taken: new Date(2023, Math.floor(i / 10), (i % 28) + 1).toLocaleString(),
}))

export default function PhotoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const photoId = Number.parseInt(params.id)
  const [infoOpen, setInfoOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Find the current photo
  const photo = allPhotos.find((p) => p.id === photoId) || allPhotos[0]

  // Get previous and next photo IDs
  const currentIndex = allPhotos.findIndex((p) => p.id === photoId)
  const prevId = currentIndex > 0 ? allPhotos[currentIndex - 1].id : null
  const nextId = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1].id : null

  useEffect(() => {
    setIsFavorite(photo.favorite || false)
    setIsLoading(true)

    // Simulate image loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [photoId, photo.favorite])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Photo removed from favorites" : "Photo added to favorites",
    })
  }

  const handleDelete = () => {
    toast({
      title: "Photo moved to trash",
      description: "Photo has been moved to trash",
    })
    if (nextId) {
      router.push(`/photos/${nextId}`)
    } else if (prevId) {
      router.push(`/photos/${prevId}`)
    } else {
      router.push("/")
    }
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your photo is being downloaded",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Sharing options opened",
    })
  }

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <span className="text-sm">{photo.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                  <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  <span className="sr-only">Favorite</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
                  <Edit className="h-5 w-5" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit photo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setInfoOpen(true)}>
                  <Info className="h-5 w-5" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Photo information</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Download</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Add to album</DropdownMenuItem>
                <DropdownMenuItem>Create a copy</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  Move to trash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </header>

      <Separator className="bg-gray-800" />

      {/* Main content */}
      <main className="relative flex-1 flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <Image src={photo.src || "/placeholder.svg"} alt={photo.alt} fill className="object-contain" priority />
          </div>
        )}

        {/* Navigation buttons */}
        {prevId && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50"
            asChild
          >
            <Link href={`/photos/${prevId}`}>
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous photo</span>
            </Link>
          </Button>
        )}

        {nextId && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50"
            asChild
          >
            <Link href={`/photos/${nextId}`}>
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next photo</span>
            </Link>
          </Button>
        )}
      </main>

      {/* Footer */}
      <footer className="flex h-12 items-center justify-between border-t border-gray-800 px-4">
        <div className="text-sm text-gray-400">{photo.location}</div>
        <div className="text-sm text-gray-400">
          Photo {currentIndex + 1} of {allPhotos.length}
        </div>
      </footer>

      {/* Info Sheet */}
      <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
        <SheetContent side="right" className="w-[350px] sm:w-[450px]">
          <SheetHeader>
            <SheetTitle>Photo Information</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="aspect-video relative overflow-hidden rounded-md">
              <Image src={photo.src || "/placeholder.svg"} alt={photo.alt} fill className="object-cover" />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date Taken</h3>
                <p>{photo.taken}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{photo.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Camera</h3>
                <p>{photo.camera}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Resolution</h3>
                <p>{photo.resolution}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                <p>{photo.size}</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="w-[350px] sm:w-[550px]">
          <SheetHeader>
            <SheetTitle>Edit Photo</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="aspect-video relative overflow-hidden rounded-md">
              <Image src={photo.src || "/placeholder.svg"} alt={photo.alt} fill className="object-cover" />
            </div>

            <Tabs defaultValue="adjust">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="adjust">Adjust</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="crop">Crop</TabsTrigger>
              </TabsList>
              <TabsContent value="adjust" className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Brightness</label>
                    <span className="text-sm text-muted-foreground">0</span>
                  </div>
                  <input type="range" min="-100" max="100" className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Contrast</label>
                    <span className="text-sm text-muted-foreground">0</span>
                  </div>
                  <input type="range" min="-100" max="100" className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Saturation</label>
                    <span className="text-sm text-muted-foreground">0</span>
                  </div>
                  <input type="range" min="-100" max="100" className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Warmth</label>
                    <span className="text-sm text-muted-foreground">0</span>
                  </div>
                  <input type="range" min="-100" max="100" className="w-full" />
                </div>
              </TabsContent>
              <TabsContent value="filters" className="py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                      <Image src={photo.src || "/placeholder.svg"} alt="Original" fill className="object-cover" />
                    </div>
                    <span className="text-sm">Original</span>
                  </div>
                  <div className="text-center">
                    <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt="Vivid"
                        fill
                        className="object-cover brightness-110 contrast-110"
                      />
                    </div>
                    <span className="text-sm">Vivid</span>
                  </div>
                  <div className="text-center">
                    <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                      <Image src={photo.src || "/placeholder.svg"} alt="Noir" fill className="object-cover grayscale" />
                    </div>
                    <span className="text-sm">Noir</span>
                  </div>
                  <div className="text-center">
                    <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                      <Image src={photo.src || "/placeholder.svg"} alt="Warm" fill className="object-cover sepia" />
                    </div>
                    <span className="text-sm">Warm</span>
                  </div>
                  <div className="text-center">
                    <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt="Cool"
                        fill
                        className="object-cover hue-rotate-180"
                      />
                    </div>
                    <span className="text-sm">Cool</span>
                  </div>
                  <div className="text-center">
                    <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt="Vintage"
                        fill
                        className="object-cover sepia brightness-75"
                      />
                    </div>
                    <span className="text-sm">Vintage</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="crop" className="py-4">
                <div className="aspect-video relative overflow-hidden rounded-md mb-4">
                  <Image src={photo.src || "/placeholder.svg"} alt={photo.alt} fill className="object-cover" />
                  <div className="absolute inset-0 border-2 border-dashed border-white/70 m-8"></div>
                </div>
                <div className="flex justify-between mb-4">
                  <Button variant="outline" size="sm">
                    Reset
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      16:9
                    </Button>
                    <Button variant="outline" size="sm">
                      4:3
                    </Button>
                    <Button variant="outline" size="sm">
                      1:1
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setEditOpen(false)
                  toast({
                    title: "Changes saved",
                    description: "Your edits have been applied to the photo",
                  })
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
