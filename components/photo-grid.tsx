"use client";

import type React from "react";

import { Photo } from "@/data/data";
import { cn } from "@/lib/utils";
import { CheckCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PhotoGridProps {
  photos: Photo[];
  isSelecting?: boolean;
  selectedPhotos?: number[];
  onSelect?: (id: number) => void;
  viewMode?: "grid" | "list";
}

export default function PhotoGrid({
  photos,
  isSelecting = false,
  selectedPhotos = [],
  onSelect = () => {},
  viewMode = "grid",
}: PhotoGridProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handlePhotoClick = (e: React.MouseEvent, id: number) => {
    if (isSelecting) {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {photos?.map((photo) => (
        <div key={photo.id} className="relative">
          <Link
            href={`/photos/${photo.id}`}
            className={cn(
              "group relative aspect-square block overflow-hidden rounded-md",
              isSelecting && "cursor-pointer"
            )}
            onClick={(e) => handlePhotoClick(e, photo.id)}
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-muted",
                loadedImages[photo.id] && "hidden"
              )}
            >
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted-foreground/20"></div>
            </div>
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className={cn(
                "object-cover transition-transform group-hover:scale-105",
                !loadedImages[photo.id] && "opacity-0"
              )}
              onLoad={() => handleImageLoad(photo.id)}
            />
            {isSelecting && (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity",
                  selectedPhotos.includes(photo.id)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
              >
                <div
                  className={cn(
                    "rounded-full border-2 border-white p-1",
                    selectedPhotos.includes(photo.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent"
                  )}
                >
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            )}
            {photo.favorite && !isSelecting && (
              <div className="absolute top-2 right-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
