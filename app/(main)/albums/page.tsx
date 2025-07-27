"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Copy,
    Download,
    Edit,
    Eye,
    Filter,
    Grid,
    Heart,
    Image as ImageIcon,
    List,
    MoreVertical,
    Plus,
    Search,
    Share2,
    SortAsc,
    Trash2,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

// Import data from your data.ts file
import {
    Album,
    albums,
    getPhotosByAlbumId,
    SharedAlbum,
    sharedAlbums,
} from "@/data/data";

export default function AlbumsPage() {
  const { toast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<
    "all" | "user" | "shared" | "system"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "count">("date");
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareAlbumId, setShareAlbumId] = useState<number | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<
    "view" | "contribute" | "edit"
  >("view");

  // Filter and sort albums
  const filteredAlbums = useMemo(() => {
    let filtered = [...albums];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (album) =>
          album.name.toLowerCase().includes(query) ||
          album.description?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((album) => album.type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return (
            new Date(b.updatedDate).getTime() -
            new Date(a.updatedDate).getTime()
          );
        case "count":
          return b.count - a.count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [albums, searchQuery, filterType, sortBy]);

  // Get shared album info
  const getSharedInfo = (albumId: number): SharedAlbum | undefined => {
    return sharedAlbums.find((shared) => shared.albumId === albumId);
  };

  // Handle album actions
  const handleShare = (albumId: number) => {
    setShareAlbumId(albumId);
    setIsShareDialogOpen(true);
  };

  const handleShareAlbum = () => {
    if (!shareEmail || !shareAlbumId) return;

    const album = albums.find((a) => a.id === shareAlbumId);
    if (!album) return;

    // In real app, this would be an API call
    toast({
      title: "Album shared",
      description: `"${album.name}" has been shared with ${shareEmail}`,
    });

    setIsShareDialogOpen(false);
    setShareEmail("");
    setShareAlbumId(null);
  };

  const handleCopyLink = (albumId: number) => {
    const shareInfo = getSharedInfo(albumId);
    const link = shareInfo?.inviteLink || `https://photos.app/album/${albumId}`;

    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleDeleteAlbum = (albumId: number) => {
    const album = albums.find((a) => a.id === albumId);
    if (!album) return;

    // In real app, this would be an API call
    toast({
      title: "Album deleted",
      description: `"${album.name}" has been deleted`,
      variant: "destructive",
    });
  };

  const handleDuplicateAlbum = (albumId: number) => {
    const album = albums.find((a) => a.id === albumId);
    if (!album) return;

    toast({
      title: "Album duplicated",
      description: `Copy of "${album.name}" has been created`,
    });
  };

  const handleDownloadAlbum = (albumId: number) => {
    const album = albums.find((a) => a.id === albumId);
    if (!album) return;

    toast({
      title: "Download started",
      description: `Downloading "${album.name}" photos`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAlbumTypeIcon = (type: Album["type"]) => {
    switch (type) {
      case "system":
        return <Heart className="h-4 w-4" />;
      case "shared":
        return <Users className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getAlbumTypeColor = (type: Album["type"]) => {
    switch (type) {
      case "system":
        return "bg-red-500/10 text-red-600";
      case "shared":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-green-500/10 text-green-600";
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setSortBy("date");
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
          <h1 className="text-xl font-semibold">Albums</h1>
          <Badge variant="outline">{filteredAlbums.length} albums</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/albums/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Album
            </Link>
          </Button>
        </div>
      </header>

      {/* Controls */}
      <div className="border-b px-4 py-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters and View Controls */}
          <div className="flex items-center gap-2">
            {/* Filter by type */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterType === "all"
                    ? "All"
                    : filterType === "user"
                    ? "My Albums"
                    : filterType === "shared"
                    ? "Shared"
                    : "System"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Albums
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("user")}>
                  My Albums
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("shared")}>
                  Shared with Me
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("system")}>
                  System Albums
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Last Updated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("count")}>
                  Photo Count
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid className="h-4 w-4" />
              )}
            </Button>

            {/* Clear Filters */}
            {(searchQuery || filterType !== "all" || sortBy !== "date") && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        {filteredAlbums.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No albums found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first album to get started"}
              </p>
              {!searchQuery && filterType === "all" && (
                <Button asChild>
                  <Link href="/albums/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Album
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => {
              const sharedInfo = getSharedInfo(album.id);
              const photos = getPhotosByAlbumId(album.id);

              return (
                <Card
                  key={album.id}
                  className="group hover:shadow-lg transition-all duration-200"
                >
                  <CardContent className="p-0">
                    {/* Album Cover */}
                    <Link href={`/albums/${album.id}`}>
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <Image
                          src={album.cover}
                          alt={album.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />

                        {/* Photo count overlay */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          {album.count}
                        </div>

                        {/* Album type indicator */}
                        <div
                          className={`absolute top-2 left-2 p-1 rounded-full ${getAlbumTypeColor(
                            album.type
                          )}`}
                        >
                          {getAlbumTypeIcon(album.type)}
                        </div>

                        {/* Shared indicator */}
                        {album.isShared && (
                          <div className="absolute bottom-2 left-2 bg-blue-500/80 text-white p-1 rounded-full">
                            <Users className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Album Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/albums/${album.id}`}>
                          <h3 className="font-semibold text-sm hover:text-primary transition-colors truncate">
                            {album.name}
                          </h3>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/albums/${album.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Album
                              </Link>
                            </DropdownMenuItem>

                            {album.type === "user" && (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link href={`/albums/${album.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Album
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleShare(album.id)}
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share Album
                                </DropdownMenuItem>
                              </>
                            )}

                            {album.isShared && (
                              <DropdownMenuItem
                                onClick={() => handleCopyLink(album.id)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Link
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => handleDuplicateAlbum(album.id)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDownloadAlbum(album.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {album.type === "user" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Album
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Album
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {album.name}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteAlbum(album.id)
                                      }
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {album.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {album.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(album.updatedDate)}
                        </span>

                        <div className="flex items-center gap-1">
                          {album.isShared && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-1 py-0"
                            >
                              <Users className="h-2 w-2 mr-1" />
                              {album.sharedWith.length + 1}
                            </Badge>
                          )}

                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0"
                          >
                            {album.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Shared with preview */}
                      {album.isShared && album.sharedWith.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Shared with:
                          </span>
                          <div className="flex -space-x-1">
                            {album.sharedWith
                              .slice(0, 3)
                              .map((email, index) => (
                                <Avatar
                                  key={email}
                                  className="h-4 w-4 border border-background"
                                >
                                  <AvatarFallback className="text-xs">
                                    {email[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            {album.sharedWith.length > 3 && (
                              <div className="h-4 w-4 rounded-full bg-muted border border-background flex items-center justify-center text-xs">
                                +{album.sharedWith.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* List View */
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredAlbums.map((album) => {
                  const sharedInfo = getSharedInfo(album.id);

                  return (
                    <div
                      key={album.id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      {/* Album Thumbnail */}
                      <Link href={`/albums/${album.id}`}>
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={album.cover}
                            alt={album.name}
                            fill
                            className="object-cover"
                          />
                          <div
                            className={`absolute top-1 left-1 p-0.5 rounded-full ${getAlbumTypeColor(
                              album.type
                            )}`}
                          >
                            {getAlbumTypeIcon(album.type)}
                          </div>
                        </div>
                      </Link>

                      {/* Album Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/albums/${album.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {album.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-1">
                            {album.isShared && (
                              <Badge variant="secondary" className="text-xs">
                                <Users className="h-2 w-2 mr-1" />
                                Shared
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {album.type}
                            </Badge>
                          </div>
                        </div>

                        {album.description && (
                          <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                            {album.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {album.count} photos
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(album.updatedDate)}
                          </span>

                          {album.isShared && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {album.sharedWith.length + 1} people
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/albums/${album.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/albums/${album.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Album
                              </Link>
                            </DropdownMenuItem>

                            {album.type === "user" && (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link href={`/albums/${album.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Album
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleShare(album.id)}
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share Album
                                </DropdownMenuItem>
                              </>
                            )}

                            {album.isShared && (
                              <DropdownMenuItem
                                onClick={() => handleCopyLink(album.id)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Link
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => handleDownloadAlbum(album.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {album.type === "user" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Album
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Album
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {album.name}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteAlbum(album.id)
                                      }
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Album</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <Input
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Permission</label>
              <select
                value={sharePermission}
                onChange={(e) =>
                  setSharePermission(
                    e.target.value as "view" | "contribute" | "edit"
                  )
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="view">View only</option>
                <option value="contribute">Can add photos</option>
                <option value="edit">Can edit album</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleShareAlbum} className="flex-1">
                Share Album
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsShareDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
