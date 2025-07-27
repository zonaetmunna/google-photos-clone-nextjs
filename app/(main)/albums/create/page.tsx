"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  Grid,
  List,
  MapPin,
  Plus,
  Search,
  Star,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// Import the data (in real app, this would be from your data store/API)
import { activePhotos, Album, albums, Photo } from "@/data/data";

export default function CreateAlbumPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Form states
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  
  // UI states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [isCreating, setIsCreating] = useState(false);

  // Get available filter options from photos
  const filterOptions = useMemo(() => {
    const allTags = new Set<string>();
    const allLocations = new Set<string>();
    const allCameras = new Set<string>();
    
    activePhotos.forEach(photo => {
      photo.tags.forEach(tag => allTags.add(tag));
      if (photo.location) allLocations.add(photo.location);
      if (photo.metadata.camera) allCameras.add(photo.metadata.camera);
    });

    return {
      tags: Array.from(allTags).sort(),
      locations: Array.from(allLocations).sort(),
      cameras: Array.from(allCameras).sort(),
    };
  }, []);

  // Filter and search photos
  const filteredPhotos = useMemo(() => {
    let filtered = [...activePhotos];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(photo =>
        photo.alt.toLowerCase().includes(query) ||
        photo.location.toLowerCase().includes(query) ||
        photo.tags.some(tag => tag.toLowerCase().includes(query)) ||
        photo.metadata.camera?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      if (selectedFilter === "favorites") {
        filtered = filtered.filter(photo => photo.favorite);
      } else if (selectedFilter === "recent") {
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(photo => new Date(photo.date) > twoWeeksAgo);
      } else if (filterOptions.tags.includes(selectedFilter)) {
        filtered = filtered.filter(photo => photo.tags.includes(selectedFilter));
      } else if (filterOptions.locations.includes(selectedFilter)) {
        filtered = filtered.filter(photo => photo.location === selectedFilter);
      } else if (filterOptions.cameras.includes(selectedFilter)) {
        filtered = filtered.filter(photo => photo.metadata.camera === selectedFilter);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "name":
          return a.alt.localeCompare(b.alt);
        case "size":
          return b.size - a.size;
        default:
          return 0;
      }
    });

    return filtered;
  }, [activePhotos, searchQuery, selectedFilter, sortBy, filterOptions]);

  // Group photos by date for better organization
  const groupedPhotos = useMemo(() => {
    const groups: Record<string, Photo[]> = {};
    
    filteredPhotos.forEach(photo => {
      const date = new Date(photo.date);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(photo);
    });

    return Object.entries(groups).sort(
      ([, a], [, b]) => new Date(b[0].date).getTime() - new Date(a[0].date).getTime()
    );
  }, [filteredPhotos]);

  const handlePhotoToggle = (id: number) => {
    setSelectedPhotos(prev =>
      prev.includes(id)
        ? prev.filter(photoId => photoId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(photo => photo.id));
    }
  };

  const handleCreateAlbum = async () => {
    if (!albumName.trim()) {
      toast({
        title: "Album name required",
        description: "Please enter a name for your album",
        variant: "destructive",
      });
      return;
    }

    if (selectedPhotos.length === 0) {
      toast({
        title: "No photos selected",
        description: "Please select at least one photo for your album",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new album object
      const newAlbum: Album = {
        id: albums.length + 1,
        name: albumName.trim(),
        description: albumDescription.trim() || undefined,
        cover: activePhotos.find(p => selectedPhotos.includes(p.id))?.src || "",
        photoIds: selectedPhotos,
        count: selectedPhotos.length,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        isShared: false,
        sharedWith: [],
        type: "user",
      };

      // In a real app, you would save this to your data store/API
      // albums.push(newAlbum);

      toast({
        title: "Album created successfully!",
        description: `"${albumName}" created with ${selectedPhotos.length} photos`,
      });

      router.push("/albums");
    } catch (error) {
      toast({
        title: "Failed to create album",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFilter("all");
    setSortBy("date");
  };

  return (
    <div className="flex h-screen flex-col w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/albums">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Create Album</h1>
        </div>
        <Button 
          disabled={!albumName.trim() || selectedPhotos.length === 0 || isCreating} 
          onClick={handleCreateAlbum}
        >
          {isCreating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating...
            </div>
          ) : (
            "Create Album"
          )}
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Album Details Form */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="album-name">Album name *</Label>
                <Input
                  id="album-name"
                  placeholder="Enter album name"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="album-description">Description (optional)</Label>
                <Textarea
                  id="album-description"
                  placeholder="Add a description for your album"
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Selection Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedPhotos.length} of {filteredPhotos.length} photos selected
              </span>
              {selectedPhotos.length > 0 && (
                <Badge variant="secondary">
                  Total size: {formatFileSize(
                    selectedPhotos.reduce((total, id) => {
                      const photo = activePhotos.find(p => p.id === id);
                      return total + (photo?.size || 0);
                    }, 0)
                  )}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedPhotos.length === filteredPhotos.length ? "Deselect All" : "Select All"}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search photos by name, location, tags, or camera..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Label className="text-sm font-medium">Filter:</Label>
                  
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-1 text-sm border rounded-md bg-background"
                  >
                    <option value="all">All Photos</option>
                    <option value="favorites">Favorites</option>
                    <option value="recent">Recent (2 weeks)</option>
                    <optgroup label="Tags">
                      {filterOptions.tags.slice(0, 10).map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Locations">
                      {filterOptions.locations.slice(0, 5).map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Cameras">
                      {filterOptions.cameras.slice(0, 5).map(camera => (
                        <option key={camera} value={camera}>{camera}</option>
                      ))}
                    </optgroup>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "name" | "size")}
                    className="px-3 py-1 text-sm border rounded-md bg-background"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                  </select>

                  {(searchQuery || selectedFilter !== "all" || sortBy !== "date") && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Grid */}
          {filteredPhotos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No photos found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Your photo library is empty"
                  }
                </p>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="space-y-6">
              {groupedPhotos.map(([monthYear, photos]) => (
                <div key={monthYear} className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Calendar className="h-5 w-5" />
                    {monthYear}
                    <Badge variant="outline" className="ml-2">
                      {photos.length} photos
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <div
                          className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedPhotos.includes(photo.id) 
                              ? "ring-2 ring-primary scale-95" 
                              : "hover:scale-105"
                          }`}
                          onClick={() => handlePhotoToggle(photo.id)}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          />
                          
                          {/* Overlay */}
                          <div
                            className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
                              selectedPhotos.includes(photo.id) 
                                ? "opacity-100" 
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <div
                              className={`rounded-full border-2 border-white p-1 transition-colors ${
                                selectedPhotos.includes(photo.id) 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-white/20"
                              }`}
                            >
                              {selectedPhotos.includes(photo.id) ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {/* Favorite indicator */}
                          {photo.favorite && (
                            <div className="absolute top-2 right-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            </div>
                          )}
                        </div>
                        
                        {/* Photo info */}
                        <div className="mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{photo.location}</span>
                          </div>
                          {photo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {photo.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {photo.tags.length > 2 && (
                                <span className="text-xs">+{photo.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedPhotos.includes(photo.id) ? "bg-primary/5" : ""
                      }`}
                      onClick={() => handlePhotoToggle(photo.id)}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{photo.alt}</h4>
                          {photo.favorite && (
                            <Star className="h-4 w-4 text-yellow-400 fill-current flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(photo.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {photo.location}
                          </span>
                          <span>{formatFileSize(photo.size)}</span>
                        </div>
                        
                        {photo.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {photo.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {photo.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{photo.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div
                          className={`rounded-full border-2 border-current p-1 ${
                            selectedPhotos.includes(photo.id) 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground"
                          }`}
                        >
                          {selectedPhotos.includes(photo.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}