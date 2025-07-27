"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Check, Link, Mail, Plus, X } from "lucide-react"
import Image from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Sample photo data
const libraryPhotos = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  src: `/placeholder.svg?height=${300 + (i % 3) * 50}&width=${400 + (i % 5) * 50}`,
  alt: `Photo ${i + 1}`,
  date: new Date(2023, Math.floor(i / 10), (i % 28) + 1).toISOString(),
}))

export default function CreateSharedAlbumPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [albumName, setAlbumName] = useState("")
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")

  const handlePhotoToggle = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((photoId) => photoId !== id))
    } else {
      setSelectedPhotos([...selectedPhotos, id])
    }
  }

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentEmail.trim() || !currentEmail.includes("@")) return

    if (!emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail])
    }

    setCurrentEmail("")
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleCreateSharedAlbum = () => {
    if (!albumName.trim()) {
      toast({
        title: "Album name required",
        description: "Please enter a name for your shared album",
        variant: "destructive",
      })
      return
    }

    if (selectedPhotos.length === 0) {
      toast({
        title: "No photos selected",
        description: "Please select at least one photo for your shared album",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Shared album created",
      description: `"${albumName}" shared album created with ${selectedPhotos.length} photos`,
    })

    router.push("/sharing")
  }

  return (
    <div className="flex h-screen flex-col w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <NextLink href="/sharing">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </NextLink>
          </Button>
          <h1 className="text-xl font-semibold">Create Shared Album</h1>
        </div>
        <Button disabled={!albumName.trim() || selectedPhotos.length === 0} onClick={handleCreateSharedAlbum}>
          Create
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="album-name">Album name</Label>
              <Input
                id="album-name"
                placeholder="Enter album name"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Share with</Label>
              <Tabs defaultValue="email">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="link">
                    <Link className="h-4 w-4 mr-2" />
                    Link
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="space-y-4 py-4">
                  <form onSubmit={handleAddEmail} className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                    />
                    <Button type="submit">Add</Button>
                  </form>

                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div key={email} className="flex items-center justify-between rounded-md border px-3 py-2">
                        <span>{email}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveEmail(email)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}

                    {emails.length === 0 && <p className="text-sm text-muted-foreground">No emails added yet</p>}
                  </div>
                </TabsContent>
                <TabsContent value="link" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm">Create a link that anyone can use to view this album</p>
                    <div className="flex gap-2">
                      <Input readOnly value="https://photos.example.com/share/abc123" />
                      <Button>Copy</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{selectedPhotos.length} photos selected</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {libraryPhotos.map((photo) => (
              <div key={photo.id} className="relative">
                <div
                  className={`group relative aspect-square overflow-hidden rounded-md cursor-pointer ${
                    selectedPhotos.includes(photo.id) ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handlePhotoToggle(photo.id)}
                >
                  <Image src={photo.src || "/placeholder.svg"} alt={photo.alt} fill className="object-cover" />
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
                      selectedPhotos.includes(photo.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`rounded-full border-2 border-white p-1 ${
                        selectedPhotos.includes(photo.id) ? "bg-primary text-primary-foreground" : "bg-transparent"
                      }`}
                    >
                      {selectedPhotos.includes(photo.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
