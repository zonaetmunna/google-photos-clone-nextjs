"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trashedPhotos } from "@/data/data";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Filter,
  Grid,
  Info,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TrashPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [trash, setTrash] = useState<typeof trashedPhotos>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay
    const timer = setTimeout(() => {
      setTrash(trashedPhotos);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Update selectAll state when selectedPhotos changes
  useEffect(() => {
    if (trash.length > 0) {
      setSelectAll(selectedPhotos.length === trash.length);
    }
  }, [selectedPhotos.length, trash.length]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(trash.map((photo) => photo.id));
    }
  };

  const togglePhotoSelection = (id: number) => {
    setSelectedPhotos((prev) => {
      if (prev.includes(id)) {
        return prev.filter((photoId) => photoId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRestore = () => {
    if (selectedPhotos.length === 0) return;

    toast({
      title: "Photos restored",
      description: `${selectedPhotos.length} photo${
        selectedPhotos.length > 1 ? "s" : ""
      } restored successfully`,
      variant: "default",
    });

    setTrash((prev) =>
      prev.filter((photo) => !selectedPhotos.includes(photo.id))
    );
    setSelectedPhotos([]);
  };

  const handleDelete = () => {
    if (selectedPhotos.length === 0) return;

    toast({
      title: "Photos permanently deleted",
      description: `${selectedPhotos.length} photo${
        selectedPhotos.length > 1 ? "s" : ""
      } permanently deleted`,
      variant: "destructive",
    });

    setTrash((prev) =>
      prev.filter((photo) => !selectedPhotos.includes(photo.id))
    );
    setSelectedPhotos([]);
  };

  const groupPhotosByMonth = (photos: typeof trashedPhotos) => {
    const grouped = photos.reduce((acc, photo) => {
      // Extract month/year from expiresOn or use a default
      const monthYear = photo.expiresOn
        ? new Date(photo.expiresOn).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "Unknown Date";

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(photo);
      return acc;
    }, {} as Record<string, typeof trashedPhotos>);

    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const PhotoGrid = ({ photos }: { photos: typeof trashedPhotos }) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <div
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            onClick={() => togglePhotoSelection(photo.id)}
          >
            {/* Image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="h-6 w-6 animate-pulse rounded-full bg-muted-foreground/20" />
            </div>

            {/* Actual image */}
            <img
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200"
              loading="lazy"
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.opacity = "1";
              }}
              style={{ opacity: 0 }}
            />

            {/* Selection overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                selectedPhotos.includes(photo.id)
                  ? "bg-black/40 opacity-100"
                  : "bg-black/20 opacity-0 group-hover:opacity-100"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  selectedPhotos.includes(photo.id)
                    ? "border-white bg-primary text-primary-foreground scale-110"
                    : "border-white bg-white/20 backdrop-blur-sm"
                }`}
              >
                <Checkbox
                  checked={selectedPhotos.includes(photo.id)}
                  className="h-4 w-4 border-0 data-[state=checked]:bg-transparent data-[state=checked]:text-inherit"
                  onCheckedChange={() => togglePhotoSelection(photo.id)}
                />
              </div>
            </div>

            {/* Selection indicator */}
            {selectedPhotos.includes(photo.id) && (
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-lg" />
            )}
          </div>

          {/* Expiry info */}
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Expires: {photo.expiresOn || "Unknown"}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-background w-full">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-muted"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to photos</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Trash</h1>
            {!isLoading && (
              <p className="text-xs text-muted-foreground">
                {trash.length} {trash.length === 1 ? "item" : "items"}
                {selectedPhotos.length > 0 &&
                  ` • ${selectedPhotos.length} selected`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedPhotos.length > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestore}
                className="hover:bg-green-50 hover:border-green-200 hover:text-green-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore ({selectedPhotos.length})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete forever
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="hover:bg-muted">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 max-w-full mx-auto">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={toggleSelectAll}
                    disabled={isLoading || trash.length === 0}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium cursor-pointer"
                  >
                    {selectAll ? "Deselect all" : "Select all"}
                  </label>
                </div>
                {!isLoading && (
                  <span className="text-sm text-muted-foreground">
                    {trash.length === 0
                      ? "No items in trash"
                      : `${trash.length} ${
                          trash.length === 1 ? "item" : "items"
                        } in trash`}
                  </span>
                )}
              </div>

              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                </div>
              ) : trash.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      Items in trash are automatically deleted after 60 days
                    </p>
                  </div>
                  <PhotoGrid photos={trash} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-6 rounded-full bg-muted p-6">
                    <Trash2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Trash is empty</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    Items you delete will appear here for 60 days before being
                    permanently deleted
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
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <Skeleton
                            key={j}
                            className="aspect-square rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : trash.length > 0 ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      Items in trash are automatically deleted after 60 days
                    </p>
                  </div>

                  {groupPhotosByMonth(trash).map(([monthYear, photos]) => (
                    <div key={monthYear} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{monthYear}</h2>
                        <span className="text-sm text-muted-foreground">
                          {photos.length}{" "}
                          {photos.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                      <PhotoGrid photos={photos} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-6 rounded-full bg-muted p-6">
                    <Trash2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Trash is empty</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    Items you delete will appear here for 60 days before being
                    permanently deleted
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
