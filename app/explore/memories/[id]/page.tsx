"use client";
// app/explore/memories/[id]/page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { memories, photos } from "@/data/data";
import {
    ArrowLeft,
    Calendar,
    Download,
    MapPin,
    Pause,
    Play,
    Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface MemoryPageProps {
  params: {
    id: string;
  };
}

export default function MemoryPage({ params }: MemoryPageProps) {
  const memoryId = parseInt(params.id);
  const memory = memories.find((mem) => mem.id === memoryId);

  if (!memory) {
    notFound();
  }

  const memoryPhotos = photos.filter(
    (photo) =>
      memory.photoIds.includes(photo.id) &&
      !photo.isTrashed &&
      !photo.isArchived
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying && memoryPhotos.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % memoryPhotos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, memoryPhotos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % memoryPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + memoryPhotos.length) % memoryPhotos.length
    );
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case "anniversary":
        return "bg-purple-100 text-purple-800";
      case "trip":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "seasonal":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get unique locations from memory photos
  const uniqueLocations = [
    ...new Set(memoryPhotos.map((photo) => photo.location)),
  ];

  return (
    <div className="flex h-screen flex-col w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Link href="/explore">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{memory.title}</h1>
            <p className="text-sm text-muted-foreground">
              {memoryPhotos.length} photos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Memory Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getMemoryTypeColor(memory.type)}>
                    {memory.type.charAt(0).toUpperCase() + memory.type.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(memory.date)}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{memory.title}</h2>
                <p className="text-muted-foreground max-w-2xl">
                  {memory.description}
                </p>
              </div>
            </div>

            {/* Memory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">{memoryPhotos.length}</div>
                <div className="text-sm text-muted-foreground">Photos</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {uniqueLocations.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {uniqueLocations.length === 1 ? "Location" : "Locations"}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {Math.round(
                    memoryPhotos.reduce((acc, photo) => acc + photo.size, 0) /
                      1024 /
                      1024
                  )}
                  MB
                </div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
            </div>

            {/* Locations */}
            {uniqueLocations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Locations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueLocations.map((location, index) => (
                    <Badge key={index} variant="secondary">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {memoryPhotos.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No photos in this memory
              </h3>
              <p className="text-muted-foreground">
                This memory doesn't contain any photos yet.
              </p>
            </div>
          ) : (
            <>
              {/* Slideshow Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Memory Slideshow</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                </div>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <Image
                    src={memoryPhotos[currentSlide]?.src}
                    alt={memoryPhotos[currentSlide]?.alt}
                    fill
                    className="object-contain"
                  />

                  {/* Navigation arrows */}
                  {memoryPhotos.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5 rotate-180" />
                      </button>
                    </>
                  )}

                  {/* Slide indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-3 py-1">
                    <span className="text-white text-sm">
                      {currentSlide + 1} / {memoryPhotos.length}
                    </span>
                  </div>
                </div>

                {/* Current photo info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-1">
                    {memoryPhotos[currentSlide]?.alt}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{memoryPhotos[currentSlide]?.location}</span>
                    <span>
                      {new Date(
                        memoryPhotos[currentSlide]?.date
                      ).toLocaleDateString()}
                    </span>
                    {memoryPhotos[currentSlide]?.metadata.camera && (
                      <span>{memoryPhotos[currentSlide]?.metadata.camera}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4">All Photos</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {memoryPhotos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className={`group relative aspect-square overflow-hidden rounded-md border cursor-pointer ${
                        index === currentSlide ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                      {/* Photo info on hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">
                          {photo.location}
                        </p>
                        <p className="text-white/80 text-xs">
                          {new Date(photo.date).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Favorite indicator */}
                      {photo.favorite && (
                        <div className="absolute top-2 right-2 text-yellow-400">
                          <div className="w-5 h-5">♥</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
