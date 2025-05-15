import { Plus, Users, LinkIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SharingPage() {
  // Sample shared albums
  const sharedAlbums = [
    {
      id: 1,
      name: "Family Trip 2023",
      cover: "/placeholder.svg?height=200&width=200",
      members: [
        { id: 1, name: "John", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 2, name: "Sarah", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 3, name: "Mike", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      lastUpdated: "2 days ago",
      itemCount: 87,
    },
    {
      id: 2,
      name: "Project X",
      cover: "/placeholder.svg?height=200&width=200",
      members: [
        { id: 4, name: "Alex", avatar: "/placeholder.svg?height=40&width=40" },
        { id: 5, name: "Emma", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      lastUpdated: "1 week ago",
      itemCount: 42,
    },
  ]

  // Sample shared with you
  const sharedWithYou = [
    {
      id: 3,
      name: "Wedding Photos",
      cover: "/placeholder.svg?height=200&width=200",
      owner: { id: 6, name: "Jessica", avatar: "/placeholder.svg?height=40&width=40" },
      lastUpdated: "3 days ago",
      itemCount: 156,
    },
  ]

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
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
              <TabsTrigger value="shared-by-you">Shared by you</TabsTrigger>
              <TabsTrigger value="shared-with-you">Shared with you</TabsTrigger>
            </TabsList>

            <TabsContent value="shared-by-you" className="mt-0">
              {sharedAlbums.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {sharedAlbums.map((album) => (
                    <Link
                      key={album.id}
                      href={`/sharing/${album.id}`}
                      className="group overflow-hidden rounded-md border"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={album.cover || "/placeholder.svg"}
                          alt={album.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{album.name}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {album.members.map((member) => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                              +{album.members.length}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{album.lastUpdated}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{album.itemCount} items</p>
                      </div>
                    </Link>
                  ))}

                  <div className="flex aspect-video flex-col items-center justify-center rounded-md border border-dashed p-6">
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-1 font-medium">Create shared album</h3>
                    <p className="text-center text-sm text-muted-foreground">Share photos with friends and family</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">No shared albums</h3>
                  <p className="mb-4 text-center text-muted-foreground">Share your photos with friends and family</p>
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
                      className="group overflow-hidden rounded-md border"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={album.cover || "/placeholder.svg"}
                          alt={album.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{album.name}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={album.owner.avatar || "/placeholder.svg"} alt={album.owner.name} />
                              <AvatarFallback>{album.owner.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">Shared by {album.owner.name}</span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{album.itemCount} items</p>
                          <span className="text-xs text-muted-foreground">{album.lastUpdated}</span>
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
                  <h3 className="mb-1 text-xl font-semibold">No albums shared with you</h3>
                  <p className="text-center text-muted-foreground">Albums shared with you will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
