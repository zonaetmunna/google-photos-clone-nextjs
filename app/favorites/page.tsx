"use client";

import PhotoGrid from "@/components/photo-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { favoritePhotos, groupPhotosByDate, Photo } from "@/data/data";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Download,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Search,
  Share2,
  Star
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SortOption = 'date-desc' | 'date-asc' | 'name' | 'location';
type ViewMode = 'grid' | 'list';

export default function FavoritesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay
    const timer = setTimeout(() => {
      setFavorites(favoritePhotos);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort favorites
  const filteredFavorites = useMemo(() => {
    let filtered = favorites;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = favorites.filter(photo =>
        photo.alt.toLowerCase().includes(query) ||
        photo.location.toLowerCase().includes(query) ||
        photo.tags.some(tag => tag.toLowerCase().includes(query)) ||
        photo.metadata.camera?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'name':
          return a.alt.localeCompare(b.alt);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });
  }, [favorites, searchQuery, sortBy]);

  // Group favorites by date for date view
  const favoritesByDate = useMemo(() => 
    groupPhotosByDate(filteredFavorites), 
    [filteredFavorites]
  );

  // Get unique locations and cameras for stats
  const uniqueLocations = useMemo(() => 
    new Set(favorites.map(photo => photo.location)).size, 
    [favorites]
  );

  const uniqueCameras = useMemo(() => 
    new Set(favorites.map(photo => photo.metadata.camera).filter(Boolean)).size, 
    [favorites]
  );

  const toggleSelect = () => {
    if (isSelecting) {
      setSelectedPhotos([]);
    }
    setIsSelecting(!isSelecting);
  };

  const togglePhotoSelection = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id));
    } else {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.length === filteredFavorites.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredFavorites.map(photo => photo.id));
    }
  };

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
          <div>
            <h1 className="text-xl font-semibold">Favorites</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredFavorites.length} photos`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isSelecting ? (
            <>
              <Button variant="outline" size="sm" onClick={toggleSelect}>
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllPhotos}
              >
                {selectedPhotos.length === filteredFavorites.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedPhotos.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedPhotos.length === 0}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Badge variant="secondary">
                {selectedPhotos.length} selected
              </Badge>
            </>
          ) : (
            <>
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" onClick={toggleSelect}>
                Select
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Search and Sort Bar */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search favorites..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="name">Name</option>
              <option value="location">Location</option>
            </select>
            {searchQuery && (
              <Badge variant="outline">
                {filteredFavorites.length} results
              </Badge>
            )}
          </div>

          {/* Stats Section */}
          {!isLoading && favorites.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-muted-foreground">Total Favorites</span>
                </div>
                <div className="text-2xl font-bold">{favorites.length}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Locations</span>
                </div>
                <div className="text-2xl font-bold">{uniqueLocations}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Cameras</span>
                </div>
                <div className="text-2xl font-bold">{uniqueCameras}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">This Month</span>
                </div>
                <div className="text-2xl font-bold">
                  {favorites.filter(photo => {
                    const photoDate = new Date(photo.date);
                    const now = new Date();
                    return photoDate.getMonth() === now.getMonth() && 
                           photoDate.getFullYear() === now.getFullYear();
                  }).length}
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="grid" value={viewMode === 'grid' ? 'grid' : 'date'}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                <span className="text-lg font-medium">
                  {isLoading ? "Loading..." : 
                   searchQuery ? `${filteredFavorites.length} matching favorites` : 
                   `${filteredFavorites.length} favorites`}
                </span>
              </div>
              <TabsList>
                <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="date" onClick={() => setViewMode('grid')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Date
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              ) : filteredFavorites.length > 0 ? (
                <PhotoGrid 
                  photos={filteredFavorites} 
                  isSelecting={isSelecting}
                  selectedPhotos={selectedPhotos}
                  onSelect={togglePhotoSelection}
                  viewMode={viewMode}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">
                    {searchQuery ? "No matching favorites" : "No favorites yet"}
                  </h3>
                  <p className="mb-4 text-center text-muted-foreground">
                    {searchQuery 
                      ? `No favorites match "${searchQuery}"`
                      : "Add photos to your favorites by clicking the star icon"
                    }
                  </p>
                  {searchQuery ? (
                    <Button onClick={() => setSearchQuery('')}>
                      Clear search
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/">Browse photos</Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="date" className="mt-0">
              {isLoading ? (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-8 w-32" />
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <Skeleton
                            key={j}
                            className="aspect-square rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredFavorites.length > 0 ? (
                <div className="space-y-8">
                  {favoritesByDate.map((group) => (
                    <div key={group.date}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">{group.date}</h2>
                        <Badge variant="outline">
                          {group.photos.length} photos
                        </Badge>
                      </div>
                      <PhotoGrid 
                        photos={group.photos} 
                        isSelecting={isSelecting}
                        selectedPhotos={selectedPhotos}
                        onSelect={togglePhotoSelection}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">
                    {searchQuery ? "No matching favorites" : "No favorites yet"}
                  </h3>
                  <p className="mb-4 text-center text-muted-foreground">
                    {searchQuery 
                      ? `No favorites match "${searchQuery}"`
                      : "Add photos to your favorites by clicking the star icon"
                    }
                  </p>
                  {searchQuery ? (
                    <Button onClick={() => setSearchQuery('')}>
                      Clear search
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/">Browse photos</Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          {!isLoading && favorites.length > 0 && !isSelecting && (
            <div className="fixed bottom-6 right-6 flex flex-col gap-2">
              <Button size="sm" className="shadow-lg">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button variant="outline" size="sm" className="shadow-lg bg-background">
                <Share2 className="h-4 w-4 mr-2" />
                Share All
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}