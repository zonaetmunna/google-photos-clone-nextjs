"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Calendar,
    Copy,
    Crown,
    Download,
    Edit,
    Eye,
    ImageIcon,
    Link2,
    Mail,
    MoreVertical,
    Settings,
    Share2,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";
import { useState } from "react";

// Import your data
import { getAlbumById, getPhotosByAlbumId, sharedAlbums } from "@/data/data";

export default function SharingDetails({ params }: { params: { id: string } }) {
  const albumId = Number.parseInt(params.id);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPermission, setNewMemberPermission] = useState("view");

  // Get album data from your data.ts
  const album = getAlbumById(albumId);
  const sharedData = sharedAlbums.find((sa) => sa.albumId === albumId);
  const albumPhotos = getPhotosByAlbumId(albumId);

  // Handle case where album is not found
  if (!album) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Album not found</h2>
          <p className="text-muted-foreground">
            The requested album could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Create members data from sharedWith emails
  const members =
    sharedData?.sharedWith.map((email, index) => ({
      id: index + 1,
      name: email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email,
      avatar: `https://images.unsplash.com/photo-${
        1472099645785 + index * 1000
      }?w=40&h=40&fit=crop&crop=face`,
      permissions: sharedData.permissions,
      joinedDate: sharedData.sharedDate,
      isOwner: false,
      lastActive: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const copyInviteLink = () => {
    if (sharedData?.inviteLink) {
      navigator.clipboard.writeText(sharedData.inviteLink);
    }
  };

  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "view":
        return <Eye className="h-3 w-3 mr-1" />;
      case "contribute":
        return <Edit className="h-3 w-3 mr-1" />;
      case "edit":
        return <Settings className="h-3 w-3 mr-1" />;
      default:
        return <Eye className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="flex h-screen flex-col w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{album.name}</h1>
              <p className="text-sm text-muted-foreground">
                {album.type === "shared" ? "Shared album" : "Your album"} •{" "}
                {album.count} items • {members.length + 1} members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite people</DialogTitle>
                  <DialogDescription>
                    Invite others to view and contribute to this album
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="permission">Permission</Label>
                    <Select
                      value={newMemberPermission}
                      onValueChange={setNewMemberPermission}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View only</SelectItem>
                        <SelectItem value="contribute">
                          Can add photos
                        </SelectItem>
                        <SelectItem value="edit">Can edit album</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-col gap-2">
                  <Button
                    onClick={() => setShowInviteDialog(false)}
                    className="w-full"
                  >
                    Send invitation
                  </Button>
                  {sharedData?.inviteLink && (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={sharedData.inviteLink}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyInviteLink}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showSettingsDialog}
              onOpenChange={setShowSettingsDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Album settings</DialogTitle>
                  <DialogDescription>
                    Manage sharing permissions and album details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="album-name">Album name</Label>
                    <Input id="album-name" defaultValue={album.name} />
                  </div>
                  <div>
                    <Label htmlFor="album-description">Description</Label>
                    <Input
                      id="album-description"
                      defaultValue={album.description || ""}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public link sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone with the link can view this album
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyInviteLink}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Copy link
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowSettingsDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setShowSettingsDialog(false)}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-full mx-auto p-6 space-y-6">
          {/* Album Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Album Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Album Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(album.createdDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last updated</p>
                  <p className="text-sm text-muted-foreground">
                    {formatRelativeTime(album.updatedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total items</p>
                  <p className="text-sm text-muted-foreground">
                    {album.count} photos
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Album type</p>
                  <Badge variant="secondary" className="capitalize">
                    {album.type}
                  </Badge>
                </div>
                {sharedData && (
                  <div>
                    <p className="text-sm font-medium">Sharing permissions</p>
                    <Badge variant="secondary" className="capitalize">
                      {sharedData.permissions}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Members ({members.length + 1})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Owner */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {album.type === "shared" && sharedData
                          ? `${sharedData.sharedBy.split("@")[0]} (Owner)`
                          : "You (Owner)"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {album.type === "shared" && sharedData
                          ? sharedData.sharedBy
                          : "you@email.com"}
                      </p>
                    </div>
                    <Crown className="h-4 w-4 text-yellow-500" />
                  </div>

                  {members.length > 0 && <Separator />}

                  {/* Other members */}
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {getPermissionIcon(member.permissions)}
                          {member.permissions}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {members.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No other members in this album
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={copyInviteLink}
                >
                  <Copy className="h-4 w-4" />
                  Copy invite link
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download all photos
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email album
                </Button>
                <Separator />
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete album
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Photos Grid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>
                    {albumPhotos.length} photos • Click to select
                  </CardDescription>
                </div>
                {selectedPhotos.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedPhotos.length} selected
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {albumPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {albumPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                        selectedPhotos.includes(photo.id)
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : ""
                      }`}
                      onClick={() => togglePhotoSelection(photo.id)}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover"
                      />
                      {selectedPhotos.includes(photo.id) && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                          ✓
                        </div>
                      )}
                      {photo.favorite && (
                        <div className="absolute top-2 left-2 text-red-500">
                          ❤️
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                        <p className="text-white text-xs truncate">
                          {photo.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No photos in this album
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Photos added to this album will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest changes and additions to this album
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Album created</span> with{" "}
                      {album.count} photos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(album.createdDate)}
                    </p>
                  </div>
                </div>

                {sharedData && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Album shared</span> with{" "}
                        {sharedData.sharedWith.length} people
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(sharedData.sharedDate)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Album updated</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(album.updatedDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
