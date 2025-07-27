"use client";
// app/explore/categories/[id]/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, photos } from "@/data/data";
import { ArrowLeft, Filter, Grid3X3, List, MoreVertical, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = parseInt(params.id);
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    notFound();
  }

  const categoryPhotos = photos.filter(photo => 
    category.photoIds.includes(photo.id) && !photo.isTrashed && !photo.isArchived
  );

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

  const filteredPhotos = categoryPhotos.filter(photo =>
    photo.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(photo => photo.id));
    }
  };

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
            <h1 className="text-xl font-semibold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">
              {filteredPhotos.length} photos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search in category..." 
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Selection Bar */}
      {selectedPhotos.length > 0 && (
        <div className="flex h-12 items-center justify-between border-b bg-blue-50 px-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedPhotos.length} selected
            </span>
            <Button variant="outline" size="sm" onClick={selectAllPhotos}>
              {selectedPhotos.length === filteredPhotos.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Add to Album
            </Button>
            <Button variant="outline" size="sm">
              Download
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No photos found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No photos match "${searchQuery}"` : 'This category is empty'}
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {filteredPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className={`group relative aspect-square overflow-hidden rounded-md border cursor-pointer ${
                        selectedPhotos.includes(photo.id) ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => togglePhotoSelection(photo.id)}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      
                      {/* Selection indicator */}
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                        selectedPhotos.includes(photo.id) 
                          ? 'bg-blue-500' 
                          : 'bg-black/30 group-hover:bg-black/50'
                      } transition-colors`}>
                        {selectedPhotos.includes(photo.id) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>

                      {/* Photo info on hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{photo.location}</p>
                        <p className="text-white/80 text-xs">
                          {new Date(photo.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPhotos.map((photo) => (
                    <div 
                      key={photo.id}
                      className={`flex items-center gap-4 p-3 rounded-md border cursor-pointer hover:bg-muted/50 ${
                        selectedPhotos.includes(photo.id) ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => togglePhotoSelection(photo.id)}
                    >
                      <div className="relative w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{photo.alt}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {photo.location}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{new Date(photo.date).toLocaleDateString()}</span>
                          <span>{(photo.size / 1024 / 1024).toFixed(1)} MB</span>
                          <span>{photo.dimensions.width}×{photo.dimensions.height}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {photo.favorite && (
                          <div className="w-4 h-4 text-yellow-500">♥</div>
                        )}
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedPhotos.includes(photo.id) 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-muted-foreground'
                        }`}>
                          {selectedPhotos.includes(photo.id) && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}