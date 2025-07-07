import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"
import { SearchBar } from "@/components/search/search-bar"

const featuredNovels = [
  {
    id: 1,
    title: "The Midnight Chronicles",
    author: "Sarah Chen",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.8,
    chapters: 45,
    genre: "Fantasy",
    description: "A thrilling tale of magic and adventure in a world where darkness threatens to consume everything.",
    isNew: true,
  },
  {
    id: 2,
    title: "Digital Hearts",
    author: "Alex Rivera",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.6,
    chapters: 32,
    genre: "Sci-Fi Romance",
    description: "Love blooms in the digital age as two programmers navigate virtual reality and real emotions.",
    isNew: false,
  },
  {
    id: 3,
    title: "The Last Library",
    author: "Emma Thompson",
    cover: "/placeholder.svg?height=300&width=200",
    rating: 4.9,
    chapters: 28,
    genre: "Dystopian",
    description: "In a world where books are forbidden, one librarian fights to preserve human knowledge.",
    isNew: true,
  },
]

const trendingNovels = [
  { id: 4, title: "Quantum Dreams", author: "Dr. Michael Park", rating: 4.7, chapters: 56 },
  { id: 5, title: "The Phoenix Rebellion", author: "Lisa Wang", rating: 4.5, chapters: 41 },
  { id: 6, title: "Echoes of Tomorrow", author: "James Mitchell", rating: 4.8, chapters: 33 },
  { id: 7, title: "The Memory Thief", author: "Anna Rodriguez", rating: 4.6, chapters: 29 },
]

export default function HomePage() {
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
              <SearchBar className="hidden md:block w-64" placeholder="Search novels, authors..." />
              <Link href="/library">
                <Button variant="ghost">My Library</Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next
              <span className="text-primary"> Great Read</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Immerse yourself in thousands of captivating novels. Read anywhere, anytime, on any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Start Reading Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Library
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Novels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Novels</h2>
            <Link href="/browse">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNovels.map((novel) => (
              <Card key={novel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={novel.cover || "/placeholder.svg"}
                    alt={novel.title}
                    width={200}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  {novel.isNew && <Badge className="absolute top-2 right-2">New</Badge>}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{novel.title}</CardTitle>
                      <CardDescription>by {novel.author}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{novel.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{novel.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{novel.genre}</Badge>
                    <span className="text-sm text-muted-foreground">{novel.chapters} chapters</span>
                  </div>
                  <Link href={`/novel/${novel.id}`}>
                    <Button className="w-full">Read Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingNovels.map((novel, index) => (
              <Card key={novel.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{novel.title}</h3>
                      <p className="text-sm text-muted-foreground">by {novel.author}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{novel.rating}</span>
                      </div>
                      <span>{novel.chapters} ch</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Novels Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">Active Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Genres</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">NovelReader</span>
              </div>
              <p className="text-muted-foreground">Your gateway to endless stories and adventures.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Browse</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/genres" className="hover:text-foreground">
                    Genres
                  </Link>
                </li>
                <li>
                  <Link href="/new-releases" className="hover:text-foreground">
                    New Releases
                  </Link>
                </li>
                <li>
                  <Link href="/trending" className="hover:text-foreground">
                    Trending
                  </Link>
                </li>
                <li>
                  <Link href="/authors" className="hover:text-foreground">
                    Authors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/library" className="hover:text-foreground">
                    My Library
                  </Link>
                </li>
                <li>
                  <Link href="/bookmarks" className="hover:text-foreground">
                    Bookmarks
                  </Link>
                </li>
                <li>
                  <Link href="/reading-history" className="hover:text-foreground">
                    Reading History
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-foreground">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 NovelReader. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
