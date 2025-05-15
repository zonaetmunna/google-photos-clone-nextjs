"use client"

import { ArrowLeft, Trash2, RotateCcw, Grid, Calendar, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// Sample photo data for trash
const trashPhotos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 100,
  src: `/placeholder.svg?height=${300 + (i % 3) * 50}&width=${400 + (i % 5) * 50}`,
  alt: `Deleted Photo ${i + 1}`,
  date: new Date(2023, Math.floor(i / 4), (i % 28) + 1).toISOString(),
  deletedOn: new Date(2023, 5, (i % 28) + 1).toLocaleDateString(),
  expiresOn: new Date(2023, 8, (i % 28) + 1).toLocaleDateString(),
}))

export default function TrashPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [trash, setTrash] = useState<typeof trashPhotos>([])
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setTrash(trashPhotos)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPhotos([])
    } else {
      setSelectedPhotos(trash.map((photo) => photo.id))
    }
    setSelectAll(!selectAll)
  }

  const togglePhotoSelection = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((photoId) => photoId !== id))
      setSelectAll(false)
    } else {
      setSelectedPhotos([...selectedPhotos, id])
      if (selectedPhotos.length + 1 === trash.length) {
        setSelectAll(true)
      }
    }
  }

  const handleRestore = () => {
    if (selectedPhotos.length === 0) return

    toast({
      title: "Photos restored",
      description: `${selectedPhotos.length} photos have been restored`,
    })

    setTrash(trash.filter((photo) => !selectedPhotos.includes(photo.id)))
    setSelectedPhotos([])
    setSelectAll(false)
  }

  const handleDelete = () => {
    if (selectedPhotos.length === 0) return

    toast({
      title: "Photos permanently deleted",
      description: `${selectedPhotos.length} photos have been permanently deleted`,
    })

    setTrash(trash.filter((photo) => !selectedPhotos.includes(photo.id)))
    setSelectedPhotos([])
    setSelectAll(false)
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
          <h1 className="text-xl font-semibold">Trash</h1>
        </div>
        <div className="flex items-center gap-2">
          {selectedPhotos.length > 0 ? (
            <>
              <Button variant="outline" size="sm" onClick={handleRestore}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete permanently
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <Tabs defaultValue="grid">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={toggleSelectAll}
                    disabled={isLoading || trash.length === 0}
                  />
                  <label htmlFor="select-all" className="text-sm">
                    {selectAll ? "Deselect all" : "Select all"}
                  </label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `${trash.length} items in trash`}
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
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              ) : trash.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Items in trash will be automatically deleted after 60 days
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {trash.map((photo) => (
                      <div key={photo.id} className="relative">
                        <div
                          className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
                          onClick={() => togglePhotoSelection(photo.id)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <div className="h-8 w-8 animate-pulse rounded-full bg-muted-foreground/20"></div>
                          </div>
                          <img
                            src={photo.src || "/placeholder.svg"}
                            alt={photo.alt}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div
                            className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
                              selectedPhotos.includes(photo.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <div
                              className={`rounded-full border-2 border-white p-1 ${
                                selectedPhotos.includes(photo.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-transparent"
                              }`}
                            >
                              <Checkbox
                                checked={selectedPhotos.includes(photo.id)}
                                className="h-4 w-4"
                                onCheckedChange={() => togglePhotoSelection(photo.id)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">Expires: {photo.expiresOn}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Trash2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">Trash is empty</h3>
                  <p className="text-center text-muted-foreground">
                    Items you delete will appear here for 60 days before being permanently deleted
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="date" className="mt-0">
              {isLoading ? (
                <div className="space-y-8">
                  {Array.from({ length: 2 }).map((_, i) => (
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
              ) : trash.length > 0 ? (
                <div className="space-y-8">
                  <p className="text-sm text-muted-foreground">
                    Items in trash will be automatically deleted after 60 days
                  </p>
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">June 2023</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {trash.slice(0, 8).map((photo) => (
                        <div key={photo.id} className="relative">
                          <div
                            className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
                            onClick={() => togglePhotoSelection(photo.id)}
                          >
                            <img
                              src={photo.src || "/placeholder.svg"}
                              alt={photo.alt}
                              className="h-full w-full object-cover"
                            />
                            <div
                              className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
                                selectedPhotos.includes(photo.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <div
                                className={`rounded-full border-2 border-white p-1 ${
                                  selectedPhotos.includes(photo.id)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-transparent"
                                }`}
                              >
                                <Checkbox
                                  checked={selectedPhotos.includes(photo.id)}
                                  className="h-4 w-4"
                                  onCheckedChange={() => togglePhotoSelection(photo.id)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">Expires: {photo.expiresOn}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">May 2023</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {trash.slice(8).map((photo) => (
                        <div key={photo.id} className="relative">
                          <div
                            className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
                            onClick={() => togglePhotoSelection(photo.id)}
                          >
                            <img
                              src={photo.src || "/placeholder.svg"}
                              alt={photo.alt}
                              className="h-full w-full object-cover"
                            />
                            <div
                              className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
                                selectedPhotos.includes(photo.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <div
                                className={`rounded-full border-2 border-white p-1 ${
                                  selectedPhotos.includes(photo.id)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-transparent"
                                }`}
                              >
                                <Checkbox
                                  checked={selectedPhotos.includes(photo.id)}
                                  className="h-4 w-4"
                                  onCheckedChange={() => togglePhotoSelection(photo.id)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">Expires: {photo.expiresOn}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Trash2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">Trash is empty</h3>
                  <p className="text-center text-muted-foreground">
                    Items you delete will appear here for 60 days before being permanently deleted
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
