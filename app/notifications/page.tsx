"use client"

import { ArrowLeft, Bell, Trash2, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// Sample notifications data
const sampleNotifications = [
  {
    id: 1,
    type: "memory",
    title: "Memories from 1 year ago",
    description: "See photos from this day last year",
    image: "/placeholder.svg?height=100&width=100",
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
      avatar: "/placeholder.svg?height=40&width=40",
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
    image: "/placeholder.svg?height=100&width=100",
    date: "1 week ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<typeof sampleNotifications>([])

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setNotifications(sampleNotifications)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All notifications marked as read",
    })
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    toast({
      title: "Notification deleted",
    })
  }

  const clearAll = () => {
    setNotifications([])
    toast({
      title: "All notifications cleared",
    })
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

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
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-2xl p-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <div
                    className={`flex items-start gap-4 rounded-lg p-3 transition-colors ${
                      notification.read ? "bg-background" : "bg-muted/50"
                    }`}
                  >
                    {notification.type === "share" && notification.user ? (
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={notification.user.avatar || "/placeholder.svg"}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                    ) : notification.image ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <Image src={notification.image || "/placeholder.svg"} alt="" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{notification.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-xl font-semibold">No notifications</h3>
              <p className="text-center text-muted-foreground">
                You're all caught up! Check back later for new notifications.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
