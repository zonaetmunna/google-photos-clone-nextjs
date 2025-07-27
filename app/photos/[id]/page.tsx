"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { activePhotos, getPhotoById } from "@/data/data"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Edit, Info, MoreHorizontal, Share, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PhotoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const photoId = Number.parseInt(params.id)
  const [infoOpen, setInfoOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Find the current photo using the utility function
  const photo = getPhotoById(photoId)
  
  // If photo doesn't exist, show 404
  if (!photo) {
    notFound()
  }

  // Get previous and next photo IDs from active photos only
  const currentIndex = activePhotos.findIndex((p) => p.id === photoId)
  const prevId = currentIndex > 0 ? activePhotos[currentIndex - 1].id : null
  const nextId = currentIndex < activePhotos.length - 1 ? activePhotos[currentIndex + 1].id : null

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

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen flex-col  text-white w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <span className="text-sm">{formatDate(photo.date)}</span>
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
          Photo {currentIndex + 1} of {activePhotos.length}
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
                <p>{formatDate(photo.date)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{photo.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Camera</h3>
                <p>{photo.metadata.camera || "Unknown"}</p>
              </div>
              {photo.metadata.iso && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ISO</h3>
                  <p>{photo.metadata.iso}</p>
                </div>
              )}
              {photo.metadata.aperture && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Aperture</h3>
                  <p>{photo.metadata.aperture}</p>
                </div>
              )}
              {photo.metadata.shutterSpeed && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Shutter Speed</h3>
                  <p>{photo.metadata.shutterSpeed}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Resolution</h3>
                <p>{photo.dimensions.width} × {photo.dimensions.height}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                <p>{formatFileSize(photo.size)}</p>
              </div>
              {photo.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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