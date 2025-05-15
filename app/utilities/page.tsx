"use client"

import { ArrowLeft, Search, Trash2, Archive, Star, Download, Share } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export default function UtilitiesPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Utilities</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Find duplicates
                    </CardTitle>
                    <CardDescription>Identify and remove duplicate photos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Last scan: 2 weeks ago</span>
                      <span>12 duplicates found</span>
                    </div>
                    <Button className="w-full">Scan now</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Archive className="h-5 w-5" />
                      Archive suggestions
                    </CardTitle>
                    <CardDescription>Automatically archive screenshots and receipts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span>24 items suggested</span>
                    </div>
                    <Button className="w-full">Review suggestions</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Best photos
                    </CardTitle>
                    <CardDescription>AI-selected best photos from your collection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="aspect-square relative rounded overflow-hidden">
                        <Image src="/placeholder.svg?height=100&width=100" alt="" fill className="object-cover" />
                      </div>
                      <div className="aspect-square relative rounded overflow-hidden">
                        <Image src="/placeholder.svg?height=100&width=100" alt="" fill className="object-cover" />
                      </div>
                      <div className="aspect-square relative rounded overflow-hidden">
                        <Image src="/placeholder.svg?height=100&width=100" alt="" fill className="object-cover" />
                      </div>
                    </div>
                    <Button className="w-full">View all</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Bulk download
                    </CardTitle>
                    <CardDescription>Download multiple photos at once</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Select photos</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Storage cleanup
                    </CardTitle>
                    <CardDescription>Free up space by removing large or blurry photos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage used</span>
                        <span>3.2 GB of 15 GB</span>
                      </div>
                      <Progress value={21} />
                    </div>
                    <Button className="w-full mt-4">Clean up</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share className="h-5 w-5" />
                      Shared with you
                    </CardTitle>
                    <CardDescription>Manage photos shared with you by others</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm mb-2">
                      <span>1 shared album</span>
                    </div>
                    <Button className="w-full">View shared</Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
