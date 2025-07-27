"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Bell, Check, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const sampleNotifications = [
  {
    id: 1,
    type: "memory",
    title: "Memories from 1 year ago",
    description: "See photos from this day last year",
    image: "/placeholder.svg",
    date: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "share",
    title: "Jessica shared an album with you",
    description: "Wedding Photos - 156 items",
    user: {
      name: "Jessica",
      avatar: "/placeholder.svg",
    },
    date: "1 day ago",
    read: false,
  },
  {
    id: 3,
    type: "update",
    title: "New features available",
    description: "Check out the new editing tools",
    date: "3 days ago",
    read: true,
  },
  {
    id: 4,
    type: "memory",
    title: "Summer memories",
    description: "Rediscover your summer photos",
    image: "/placeholder.svg",
    date: "1 week ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<typeof sampleNotifications>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(sampleNotifications)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({ title: "All notifications marked as read" })
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast({ title: "Notification deleted" })
  }

  const clearAll = () => {
    setNotifications([])
    toast({ title: "All notifications cleared" })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen flex-col w-full">
      <header className="flex h-16 items-center justify-between border-b px-4 bg-background">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-muted/10">
        <div className="max-w-7xl mx-auto p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group relative flex gap-4 rounded-xl p-4 shadow-sm border transition hover:shadow-md ${
                    n.read ? "bg-background" : "bg-accent/10"
                  }`}
                >
                  {n.type === "share" && n.user ? (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={n.user.avatar} alt={n.user.name} />
                      <AvatarFallback>{n.user.name[0]}</AvatarFallback>
                    </Avatar>
                  ) : n.image ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={n.image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground">
                      {n.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {n.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {n.date}
                    </p>
                  </div>

                  <div className="flex gap-1 absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition">
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(n.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(n.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-xl font-semibold">No notifications</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You're all caught up! Check back later for new notifications.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
