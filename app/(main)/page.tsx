"use client";

import PhotoGrid from "@/components/photo-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  activePhotos,
  albums,
  categories,
  groupPhotosByDate,
  memories,
  searchPhotos,
  sharedAlbums
} from "@/data/data";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Filter,
  Grid3X3,
  Heart,
  List,
  MapPin,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  Upload,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type SortOption = 'date-desc' | 'date-asc' | 'name' | 'size';
type ViewMode = 'grid' | 'list';

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState("photos");

  // Get filtered and sorted photos
  const filteredPhotos = useMemo(() => {
    let photos = activePhotos;
    
    // Apply search filter
    if (searchQuery.trim()) {
      photos = searchPhotos(searchQuery);
    }
    
    // Apply sorting
    const sorted = [...photos].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'name':
          return a.alt.localeCompare(b.alt);
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [searchQuery, sortBy]);

  const photoGroups = useMemo(() => 
    groupPhotosByDate(filteredPhotos), 
    [filteredPhotos]
  );

  // Get recent memories (last 3)
  const recentMemories = memories.slice(0, 3);

  // Get user albums (exclude system albums)
  const userAlbums = albums.filter(album => album.type === 'user');

  // Get shared albums data
  const receivedSharedAlbums = albums.filter(album => album.type === 'shared');

  const toggleSelect = () => {
    if (isSelecting) {
      setSelectedPhotos([]);
    }
    setIsSelecting(!isSelecting);
  };

  const togglePhotoSelection = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((photoId) => photoId !== id));
    } else {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(photo => photo.id));
    }
  };

  const handleAddToAlbum = () => {
    toast({
      title: "Added to album",
      description: `${selectedPhotos.length} photos added to album`,
    });
    setIsSelecting(false);
    setSelectedPhotos([]);
  };  

  const handleDelete = () => {
    toast({
      title: "Photos moved to trash",
      description: `${selectedPhotos.length} photos moved to trash`,
      variant: "destructive",
    });
    setIsSelecting(false);
    setSelectedPhotos([]);
  };

  const handleShare = () => {
    toast({
      title: "Sharing link created",
      description: `${selectedPhotos.length} photos ready to share`,
    });
    setIsSelecting(false);
    setSelectedPhotos([]);
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="explore" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Explore
              </TabsTrigger>
              <TabsTrigger value="albums" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Albums
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Sharing
              </TabsTrigger>
            </TabsList>
            
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
                    {selectedPhotos.length === filteredPhotos.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddToAlbum}
                    disabled={selectedPhotos.length === 0}
                  >
                    Add to album
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    disabled={selectedPhotos.length === 0}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={selectedPhotos.length === 0}
                  >
                    Delete
                  </Button>
                  <Badge variant="secondary">
                    {selectedPhotos.length} selected
                  </Badge>
                </>
              ) : (
                <>
                  {activeTab === 'photos' && (
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
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={toggleSelect}>
                    Select
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search and Sort Bar for Photos */}
          {activeTab === 'photos' && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search photos, locations, tags..." 
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
                <option value="size">File size</option>
              </select>
              {searchQuery && (
                <Badge variant="outline">
                  {filteredPhotos.length} results
                </Badge>
              )}
            </div>
          )}

          <TabsContent value="photos" className="mt-0">
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No photos found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? `No photos match "${searchQuery}"` : 'No photos available'}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Photos</span>
                    </div>
                    <div className="text-2xl font-bold">{activePhotos.length}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Favorites</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {activePhotos.filter(p => p.favorite).length}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Locations</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {new Set(activePhotos.map(p => p.location)).size}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">This Month</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {activePhotos.filter(p => {
                        const photoDate = new Date(p.date);
                        const now = new Date();
                        return photoDate.getMonth() === now.getMonth() && 
                               photoDate.getFullYear() === now.getFullYear();
                      }).length}
                    </div>
                  </div>
                </div>

                {/* Photo Groups */}
                {photoGroups.map((group) => (
                  <div key={group.date} className="mb-8">
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
              </>
            )}
          </TabsContent>

          <TabsContent value="explore" className="mt-0">
            <div className="grid gap-8">
              {/* Recent Memories */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Recent Memories
                  </h2>
                  <Link href="/explore">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {recentMemories.map((memory) => (
                    <Link
                      key={memory.id}
                      href={`/explore/memories/${memory.id}`}
                      className="group relative aspect-video overflow-hidden rounded-xl border hover:shadow-lg transition-all"
                    >
                      <Image
                        src={memory.cover}
                        alt={memory.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="capitalize">
                          {memory.type}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 p-4 text-white">
                        <h3 className="text-lg font-medium mb-1">
                          {memory.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-1">
                          {memory.description}
                        </p>
                        <p className="text-xs opacity-75">
                          {memory.photoIds.length} photos • {new Date(memory.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Categories */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Categories</h2>
                  <Link href="/explore">
                    <Button variant="outline" size="sm">Explore More</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      href={`/explore/categories/${category.id}`}
                      className="group overflow-hidden rounded-md border hover:shadow-md transition-all"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={category.cover}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs font-medium">{category.name}</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.photoIds.length} photos
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="albums" className="mt-0">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {/* Create Album Card */}
              <Link
                href="/albums/create"
                className="flex aspect-square flex-col items-center justify-center rounded-md border border-dashed hover:border-solid hover:shadow-md transition-all p-6"
              >
                <div className="mb-4 rounded-full bg-muted p-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 font-medium">Create album</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Organize your photos
                </p>
              </Link>

              {/* User Albums */}
              {userAlbums.map((album) => (
                <Link
                  key={album.id}
                  href={`/albums/${album.id}`}
                  className="group overflow-hidden rounded-md border hover:shadow-md transition-all"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={album.cover}
                      alt={album.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {album.isShared && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          <Share2 className="h-3 w-3 mr-1" />
                          Shared
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{album.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {album.count} photos
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated {new Date(album.updatedDate).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sharing" className="mt-0">
            {receivedSharedAlbums.length > 0 || sharedAlbums.length > 0 ? (
              <div className="space-y-8">
                {/* Shared with me */}
                {receivedSharedAlbums.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Shared with me
                    </h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {receivedSharedAlbums.map((album) => (
                        <Link
                          key={album.id}
                          href={`/albums/${album.id}`}
                          className="group overflow-hidden rounded-md border hover:shadow-md transition-all"
                        >
                          <div className="aspect-square relative overflow-hidden">
                            <Image
                              src={album.cover}
                              alt={album.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                Shared
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{album.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {album.count} photos
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              From {album.sharedWith[0]?.split('@')[0] || 'Unknown'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* My shared albums */}
                {sharedAlbums.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Share2 className="h-5 w-5" />
                      My shared albums
                    </h2>
                    <div className="space-y-3">
                      {sharedAlbums.map((sharedAlbum) => {
                        const album = albums.find(a => a.id === sharedAlbum.albumId);
                        if (!album) return null;
                        
                        return (
                          <div key={sharedAlbum.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="relative w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
                              <Image
                                src={album.cover}
                                alt={album.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium">{album.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Shared with {sharedAlbum.sharedWith.length} people
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sharedAlbum.permissions} access • Shared {new Date(sharedAlbum.sharedDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {sharedAlbum.permissions}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                Manage
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Share2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-xl font-semibold">No shared albums</h3>
                <p className="mb-4 text-center text-muted-foreground">
                  Share your photos with friends and family
                </p>
                <Button asChild>
                  <Link href="/sharing/create">Create shared album</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}