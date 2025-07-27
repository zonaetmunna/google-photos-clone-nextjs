import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { albums, getPhotoById, sharedAlbums } from "@/data/data";
import { LinkIcon, Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SharingPage() {
  // Get albums shared by you (user created albums that are shared)
  const sharedByYou = albums.filter(album => 
    album.isShared && album.type === "user"
  ).map(album => {
    const sharedData = sharedAlbums.find(sa => sa.albumId === album.id);
    const coverPhoto = getPhotoById(album.photoIds[0]);
    
    return {
      id: album.id,
      name: album.name,
      cover: coverPhoto?.src || album.cover,
      members: sharedData?.sharedWith.map((email, index) => ({
        id: index + 1,
        name: email.split('@')[0], // Extract name from email
        avatar: `/placeholder.svg?height=40&width=40`,
        email
      })) || [],
      lastUpdated: formatDate(album.updatedDate),
      itemCount: album.count,
      permissions: sharedData?.permissions || "view",
      inviteLink: sharedData?.inviteLink
    };
  });

  // Get albums shared with you (albums where type is "shared")
  const sharedWithYou = albums.filter(album => 
    album.type === "shared"
  ).map(album => {
    const sharedData = sharedAlbums.find(sa => sa.albumId === album.id);
    const coverPhoto = getPhotoById(album.photoIds[0]);
    
    return {
      id: album.id,
      name: album.name,
      cover: coverPhoto?.src || album.cover,
      owner: {
        id: 1,
        name: sharedData?.sharedBy.split('@')[0] || "Unknown",
        avatar: `/placeholder.svg?height=40&width=40`,
        email: sharedData?.sharedBy
      },
      lastUpdated: formatDate(album.updatedDate),
      itemCount: album.count,
      permissions: sharedData?.permissions || "view",
      sharedDate: sharedData?.sharedDate ? formatDate(sharedData.sharedDate) : ""
    };
  });

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  return (
    <div className="flex h-screen flex-col w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-semibold">Sharing</h1>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Create shared album
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <Tabs defaultValue="shared-by-you">
            <TabsList className="mb-4">
              <TabsTrigger value="shared-by-you">
                Shared by you ({sharedByYou.length})
              </TabsTrigger>
              <TabsTrigger value="shared-with-you">
                Shared with you ({sharedWithYou.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shared-by-you" className="mt-0">
              {sharedByYou.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {sharedByYou.map((album) => (
                    <Link
                      key={album.id}
                      href={`/sharing/${album.id}`}
                      className="group overflow-hidden rounded-md border hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={album.cover}
                          alt={album.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {album.inviteLink && (
                          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                            <LinkIcon className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium truncate">{album.name}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {album.members.slice(0, 3).map((member) => (
                              <Avatar
                                key={member.id}
                                className="h-6 w-6 border-2 border-background"
                                title={member.email}
                              >
                                <AvatarImage
                                  src={member.avatar}
                                  alt={member.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {member.name[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {album.members.length > 3 && (
                              <div 
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs border-2 border-background"
                                title={`${album.members.length - 3} more members`}
                              >
                                +{album.members.length - 3}
                              </div>
                            )}
                            {album.members.length === 0 && (
                              <div className="text-xs text-muted-foreground">
                                No members
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {album.lastUpdated}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {album.itemCount} items
                          </p>
                          <span className="text-xs text-blue-600 capitalize">
                            {album.permissions}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Create new shared album card */}
                  <Link href="/sharing/create" className="flex aspect-video flex-col items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-1 font-medium">Create shared album</h3>
                    <p className="text-center text-sm text-muted-foreground px-4">
                      Share photos with friends and family
                    </p>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">
                    No shared albums
                  </h3>
                  <p className="mb-4 text-center text-muted-foreground">
                    Share your photos with friends and family to get started
                  </p>
                  <Button>Create shared album</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared-with-you" className="mt-0">
              {sharedWithYou.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {sharedWithYou.map((album) => (
                    <Link
                      key={album.id}
                      href={`/sharing/${album.id}`}
                      className="group overflow-hidden rounded-md border hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={album.cover}
                          alt={album.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Shared
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium truncate">{album.name}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={album.owner.avatar}
                              alt={album.owner.name}
                            />
                            <AvatarFallback className="text-xs">
                              {album.owner.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground truncate">
                            Shared by {album.owner.name}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {album.itemCount} items
                          </p>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">
                              {album.lastUpdated}
                            </span>
                            <span className="text-xs text-blue-600 capitalize">
                              {album.permissions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <LinkIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">
                    No albums shared with you
                  </h3>
                  <p className="text-center text-muted-foreground">
                    Albums shared with you will appear here
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