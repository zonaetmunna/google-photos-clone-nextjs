import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExplorePage() {
  // Sample categories
  const categories = [
    { id: 1, name: "People", count: 245, cover: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Places", count: 128, cover: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Things", count: 76, cover: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Animals", count: 54, cover: "/placeholder.svg?height=200&width=200" },
    { id: 5, name: "Food", count: 87, cover: "/placeholder.svg?height=200&width=200" },
    { id: 6, name: "Selfies", count: 112, cover: "/placeholder.svg?height=200&width=200" },
  ]

  // Sample memories
  const memories = [
    { id: 1, name: "This day 1 year ago", count: 12, cover: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Summer 2022", count: 48, cover: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Trip to Paris", count: 76, cover: "/placeholder.svg?height=200&width=200" },
  ]

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-xl font-semibold">Explore</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search" className="pl-10 pr-4" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <Tabs defaultValue="categories">
            <TabsList className="mb-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="memories">Memories</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="mt-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/explore/categories/${category.id}`}
                    className="group overflow-hidden rounded-md border"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={category.cover || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} items</p>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="memories" className="mt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {memories.map((memory) => (
                  <Link
                    key={memory.id}
                    href={`/explore/memories/${memory.id}`}
                    className="group overflow-hidden rounded-md border"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={memory.cover || "/placeholder.svg"}
                        alt={memory.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 p-4 text-white">
                        <h3 className="text-lg font-medium">{memory.name}</h3>
                        <p className="text-sm opacity-90">{memory.count} items</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
