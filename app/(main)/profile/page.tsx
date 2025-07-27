"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft,
    Calendar,
    Camera,
    Check,
    Edit,
    HardDrive,
    Image,
    Plus,
    Settings,
    Share2,
    Star,
    Upload,
    Users,
    Video,
    X
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = React.createRef<HTMLInputElement>();  
  // User profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Photography enthusiast and traveler. Love capturing life's beautiful moments.",
    avatar: "/placeholder.svg?height=96&width=96",
    isPremium: true,
    joinDate: "January 2023",
  });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState({
    name: profile.name,
    bio: profile.bio,
    avatar: profile.avatar,
  });

  // Stats state
  const [stats, setStats] = useState({
    totalPhotos: 2847,
    totalVideos: 156,
    storageUsed: 3.2,
    storageTotal: 15,
    albumsCreated: 12,
    photosShared: 89,
  });

  // Recent activity state
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "upload",
      description: "Uploaded 15 photos from vacation",
      date: "2 hours ago",
      icon: Camera,
    },
    {
      id: 2,
      type: "share",
      description: "Shared album 'Summer 2024' with 3 people",
      date: "1 day ago",
      icon: Share2,
    },
    {
      id: 3,
      type: "create",
      description: "Created new album 'Family Dinner'",
      date: "3 days ago",
      icon: Image,
    },
    {
      id: 4,
      type: "favorite",
      description: "Added 8 photos to favorites",
      date: "1 week ago",
      icon: Star,
    },
  ]);

  const storagePercentage = (stats.storageUsed / stats.storageTotal) * 100;

  const quickActions = [
    {
      title: "Upload Photos",
      description: "Add new photos to your library",
      icon: Camera,
      action: () => handleQuickUpload(),
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Create Album",
      description: "Organize your photos into albums",
      icon: Image,
      action: () => handleCreateAlbum(),
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Share Photos",
      description: "Share memories with friends and family",
      icon: Share2,
      action: () => handleSharePhotos(),
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Manage Storage",
      description: "Free up space and organize files",
      icon: HardDrive,
      action: () => handleManageStorage(),
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  // Handle avatar upload
  const handleAvatarUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const imageUrl = URL.createObjectURL(file);
        setEditForm(prev => ({ ...prev, avatar: imageUrl }));
        setIsUploading(false);
        toast({
          title: "Avatar uploaded",
          description: "Your profile picture has been updated",
        });
      }, 1500);
    }
  };

  // Handle profile save
  const handleSaveProfile = () => {
    setProfile(prev => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio,
      avatar: editForm.avatar,
    }));
    
    // Add activity
    const newActivity = {
      id: Date.now(),
      type: "edit",
      description: "Updated profile information",
      date: "Just now",
      icon: Edit,
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
    
    setIsEditModalOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  // Quick action handlers
  const handleQuickUpload = () => {
    setStats(prev => ({
      ...prev,
      totalPhotos: prev.totalPhotos + Math.floor(Math.random() * 20) + 5,
      storageUsed: prev.storageUsed + 0.1,
    }));
    
    const newActivity = {
      id: Date.now(),
      type: "upload",
      description: `Uploaded ${Math.floor(Math.random() * 15) + 5} new photos`,
      date: "Just now",
      icon: Camera,
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
    
    toast({
      title: "Photos uploaded",
      description: "Your photos have been added to your library",
    });
  };

  const handleCreateAlbum = () => {
    setStats(prev => ({
      ...prev,
      albumsCreated: prev.albumsCreated + 1,
    }));
    
    const albumNames = ["Vacation 2024", "Family Time", "Nature Shots", "City Life", "Food Adventures"];
    const randomName = albumNames[Math.floor(Math.random() * albumNames.length)];
    
    const newActivity = {
      id: Date.now(),
      type: "create",
      description: `Created new album '${randomName}'`,
      date: "Just now",
      icon: Image,
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
    
    toast({
      title: "Album created",
      description: `New album '${randomName}' has been created`,
    });
  };

  const handleSharePhotos = () => {
    const shareCount = Math.floor(Math.random() * 10) + 1;
    setStats(prev => ({
      ...prev,
      photosShared: prev.photosShared + shareCount,
    }));
    
    const newActivity = {
      id: Date.now(),
      type: "share",
      description: `Shared ${shareCount} photos with friends`,
      date: "Just now",
      icon: Share2,
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
    
    toast({
      title: "Photos shared",
      description: `${shareCount} photos have been shared successfully`,
    });
  };

  const handleManageStorage = () => {
    setStats(prev => ({
      ...prev,
      storageUsed: Math.max(prev.storageUsed - 0.5, 0),
    }));
    
    const newActivity = {
      id: Date.now(),
      type: "cleanup",
      description: "Freed up storage space",
      date: "Just now",
      icon: HardDrive,
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
    
    toast({
      title: "Storage optimized",
      description: "Successfully freed up storage space",
    });
  };

  const handleUpgradeStorage = () => {
    setStats(prev => ({
      ...prev,
      storageTotal: prev.storageTotal + 100,
    }));
    setProfile(prev => ({ ...prev, isPremium: true }));
    
    toast({
      title: "Storage upgraded",
      description: "Your storage has been upgraded to premium",
    });
  };

  const removeActivity = (id: number) => {
    setRecentActivity(prev => prev.filter(activity => activity.id !== id));
    toast({
      title: "Activity removed",
      description: "Activity has been removed from your timeline",
    });
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
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <div className="grid gap-8">
            {/* Profile Header */}
            <section className="text-center">
              <div className="mb-6 flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      {profile.bio}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {profile.isPremium && (
                      <Badge variant="secondary">Premium Member</Badge>
                    )}
                    <Badge variant="outline">Joined {profile.joinDate}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={editForm.avatar} alt="Profile" />
                            <AvatarFallback>
                              {editForm.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading ? "Uploading..." : "Change Photo"}
                        </Button>
                      </div>

                      {/* Name Input */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your name"
                        />
                      </div>

                      {/* Bio Input */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSaveProfile} className="flex-1">
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditModalOpen(false)}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </section>

            <Separator />

            {/* Stats Grid */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Your Library</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Image className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stats.totalPhotos.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Photos</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Video className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stats.totalVideos}</div>
                    <p className="text-sm text-muted-foreground">Videos</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stats.albumsCreated}</div>
                    <p className="text-sm text-muted-foreground">Albums</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Share2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stats.photosShared}</div>
                    <p className="text-sm text-muted-foreground">Shared</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Storage Usage */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Storage Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Used Storage</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.storageUsed.toFixed(1)} GB of {stats.storageTotal} GB
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div 
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${storagePercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(100 - storagePercentage).toFixed(1)}% remaining
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleUpgradeStorage}>
                        <Plus className="h-4 w-4 mr-2" />
                        Upgrade Storage
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleManageStorage}>
                        Free Up Space
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Quick Actions */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card key={index} className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                    <CardContent className="p-4" onClick={action.action}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 group">
                        <div className="p-2 rounded-lg bg-muted">
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          onClick={() => removeActivity(activity.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {recentActivity.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No recent activity to show
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Account Actions */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/account/subscription">Manage Subscription</Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/account/privacy">Privacy Settings</Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/account/download">Download Your Data</Link>
                    </Button>
                    <Button variant="outline" className="justify-start text-destructive hover:text-destructive" asChild>
                      <Link href="/account/delete">Delete Account</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}