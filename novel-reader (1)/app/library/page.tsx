import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Filter, Grid, Star, Clock, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { requireAuth, getUserReadingProgress } from "@/lib/auth"
import { SearchBar } from "@/components/search/search-bar"

const myNovels = [
  {
    id: 1,
    title: "The Midnight Chronicles",
    author: "Sarah Chen",
    cover: "/placeholder.svg?height=300&width=200",
    progress: 75,
    currentChapter: 34,
    totalChapters: 45,
    lastRead: "2 hours ago",
    rating: 4.8,
    status: "reading",
  },
  {
    id: 2,
    title: "Digital Hearts",
    author: "Alex Rivera",
    cover: "/placeholder.svg?height=300&width=200",
    progress: 100,
    currentChapter: 32,
    totalChapters: 32,
    lastRead: "1 week ago",
    rating: 4.6,
    status: "completed",
  },
  {
    id: 3,
    title: "The Last Library",
    author: "Emma Thompson",
    cover: "/placeholder.svg?height=300&width=200",
    progress: 25,
    currentChapter: 7,
    totalChapters: 28,
    lastRead: "3 days ago",
    rating: 4.9,
    status: "reading",
  },
]

const bookmarkedNovels = [
  {
    id: 4,
    title: "Quantum Dreams",
    author: "Dr. Michael Park",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.7,
    chapters: 56,
    genre: "Sci-Fi",
  },
  {
    id: 5,
    title: "The Phoenix Rebellion",
    author: "Lisa Wang",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.5,
    chapters: 41,
    genre: "Fantasy",
  },
]

export default async function LibraryPage() {
  const user = await requireAuth()
  const userProgress = await getUserReadingProgress(user.id)

  // Update the novels data to use real progress
  const myNovels = [
    {
      id: 1,
      title: "The Midnight Chronicles",
      author: "Sarah Chen",
      cover: "/placeholder.svg?height=300&width=200",
      progress: userProgress.find((p) => p.novelId === "1")?.progress || 0,
      currentChapter: userProgress.find((p) => p.novelId === "1")?.currentChapter || 1,
      totalChapters: 45,
      lastRead: userProgress.find((p) => p.novelId === "1")?.lastRead
        ? new Date(userProgress.find((p) => p.novelId === "1")!.lastRead).toLocaleString()
        : "Never",
      rating: 4.8,
      status: userProgress.find((p) => p.novelId === "1")?.status || "reading",
    },
    {
      id: 2,
      title: "Digital Hearts",
      author: "Alex Rivera",
      cover: "/placeholder.svg?height=300&width=200",
      progress: userProgress.find((p) => p.novelId === "2")?.progress || 0,
      currentChapter: userProgress.find((p) => p.novelId === "2")?.currentChapter || 1,
      totalChapters: 32,
      lastRead: userProgress.find((p) => p.novelId === "2")?.lastRead
        ? new Date(userProgress.find((p) => p.novelId === "2")!.lastRead).toLocaleString()
        : "Never",
      rating: 4.6,
      status: userProgress.find((p) => p.novelId === "2")?.status || "completed",
    },
    {
      id: 3,
      title: "The Last Library",
      author: "Emma Thompson",
      cover: "/placeholder.svg?height=300&width=200",
      progress: userProgress.find((p) => p.novelId === "3")?.progress || 0,
      currentChapter: userProgress.find((p) => p.novelId === "3")?.currentChapter || 1,
      totalChapters: 28,
      lastRead: userProgress.find((p) => p.novelId === "3")?.lastRead
        ? new Date(userProgress.find((p) => p.novelId === "3")!.lastRead).toLocaleString()
        : "Never",
      rating: 4.9,
      status: userProgress.find((p) => p.novelId === "3")?.status || "reading",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">NovelReader</span>
            </Link>

            <div className="flex items-center space-x-4">
              <SearchBar className="hidden md:block w-64" placeholder="Search your library..." />
              <Button variant="ghost">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost">
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Library</h1>
          <p className="text-muted-foreground">Manage your reading collection and track your progress</p>
        </div>

        <Tabs defaultValue="reading" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="all">All Books</TabsTrigger>
          </TabsList>

          <TabsContent value="reading" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myNovels
                .filter((novel) => novel.status === "reading")
                .map((novel) => (
                  <Card key={novel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={novel.cover || "/placeholder.svg"}
                        alt={novel.title}
                        width={200}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="text-white text-sm">
                          Chapter {novel.currentChapter} of {novel.totalChapters}
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                          <div
                            className="bg-white rounded-full h-2 transition-all"
                            style={{ width: `${novel.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{novel.title}</CardTitle>
                      <CardDescription>by {novel.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{novel.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{novel.lastRead}</span>
                        </div>
                      </div>
                      <Link href={`/read/${novel.id}/${novel.currentChapter}`}>
                        <Button className="w-full">Continue Reading</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myNovels
                .filter((novel) => novel.status === "completed")
                .map((novel) => (
                  <Card key={novel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={novel.cover || "/placeholder.svg"}
                        alt={novel.title}
                        width={200}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">Completed</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{novel.title}</CardTitle>
                      <CardDescription>by {novel.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{novel.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{novel.totalChapters} chapters</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/read/${novel.id}/1`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Re-read
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="bookmarked" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedNovels.map((novel) => (
                <Card key={novel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={novel.cover || "/placeholder.svg"}
                      alt={novel.title}
                      width={200}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Bookmark className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{novel.title}</CardTitle>
                    <CardDescription>by {novel.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">{novel.genre}</Badge>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{novel.rating}</span>
                      </div>
                    </div>
                    <Link href={`/novel/${novel.id}`}>
                      <Button className="w-full">Start Reading</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...myNovels, ...bookmarkedNovels].map((novel) => (
                <Card key={novel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={novel.cover || "/placeholder.svg"}
                      alt={novel.title}
                      width={200}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{novel.title}</CardTitle>
                    <CardDescription>by {novel.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/novel/${novel.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
