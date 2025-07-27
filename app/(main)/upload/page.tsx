"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, File, Film, ImageIcon, Upload, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    // Filter for images and videos
    const mediaFiles = newFiles.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))

    setFiles((prev) => [...prev, ...mediaFiles])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const startUpload = () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)

          toast({
            title: "Upload complete",
            description: `Successfully uploaded ${files.length} files`,
          })

          setTimeout(() => {
            router.push("/")
          }, 1500)

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6" />
    } else if (file.type.startsWith("video/")) {
      return <Film className="h-6 w-6" />
    } else {
      return <File className="h-6 w-6" />
    }
  }

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file)
    }
    return null
  }

  return (
    <div className="flex h-screen flex-col w-full" >
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Upload</h1>
        </div>
        <Button disabled={files.length === 0 || uploading} onClick={startUpload}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4">
        {files.length === 0 ? (
          <div
            className={`flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4 rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-xl font-semibold">Drag and drop files</h3>
            <p className="mb-4 text-muted-foreground">
              or{" "}
              <button className="text-primary underline" onClick={() => fileInputRef.current?.click()}>
                browse
              </button>{" "}
              to choose files
            </p>
            <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, GIF, WEBP, MP4, MOV</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading {files.length} files</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {files.map((file, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-md border">
                  {getFilePreview(file) ? (
                    <Image src={getFilePreview(file) || ""} alt={file.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">{getFileIcon(file)}</div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-7 w-7 rounded-full bg-black/50 p-0"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                    <div className="text-xs text-white">{file.name}</div>
                  </div>
                </div>
              ))}
              <button
                className="flex aspect-square flex-col items-center justify-center rounded-md border border-dashed"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <div className="mb-2 rounded-full bg-muted p-2">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-sm">Add more</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
