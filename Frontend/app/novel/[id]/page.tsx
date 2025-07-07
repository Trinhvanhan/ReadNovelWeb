import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Star, Bookmark, Share, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SearchBar } from "@/components/search/search-bar"

// Mock data - in a real app, this would come from an API
const novel = {
  id: 1,
  title: "The Midnight Chronicles",
  author: "Sarah Chen",
  cover: "/placeholder.svg?height=400&width=300",
  rating: 4.8,
  totalRatings: 2847,
  chapters: 45,
  status: "Ongoing",
  genre: ["Fantasy", "Adventure", "Magic"],
  tags: ["Strong Female Lead", "Magic System", "Epic Fantasy", "Coming of Age"],
  description: `In a world where darkness threatens to consume everything, young Aria discovers she possesses an ancient power that could either save her realm or destroy it completely. 

As the last heir to the Midnight Throne, she must navigate treacherous political alliances, master her newfound abilities, and uncover the truth about her family's mysterious past. With the help of unlikely allies and facing impossible odds, Aria embarks on a journey that will test not only her magical prowess but also her courage, wisdom, and heart.

The fate of the realm hangs in the balance, and time is running out. Will Aria embrace her destiny as the Midnight Queen, or will the shadows claim victory once and for all?`,
  publishedDate: "2023-06-15",
  lastUpdated: "2024-01-15",
  wordCount: "450,000",
  readingTime: "18 hours",
  language: "English",
}

const chapters = [
  { number: 1, title: "The Awakening", publishDate: "2023-06-15", wordCount: 3200 },
  { number: 2, title: "Shadows of the Past", publishDate: "2023-06-17", wordCount: 3800 },
  { number: 3, title: "The First Test", publishDate: "2023-06-20", wordCount: 4100 },
  { number: 4, title: "Allies and Enemies", publishDate: "2023-06-22", wordCount: 3900 },
  { number: 5, title: "The Hidden Truth", publishDate: "2023-06-25", wordCount: 4300 },
]

const reviews = [
  {
    id: 1,
    user: "BookLover123",
    rating: 5,
    comment: "Absolutely incredible! The world-building is phenomenal and the character development is top-notch.",
    date: "2024-01-10",
  },
  {
    id: 2,
    user: "FantasyFan",
    rating: 4,
    comment: "Great story with amazing magic system. Can't wait for the next chapter!",
    date: "2024-01-08",
  },
]

export default function NovelDetailPage() {
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

            <SearchBar className="hidden md:block w-64" placeholder="Search novels, authors..." />

            <div className="flex items-center space-x-4">
              <Link href="/library">
                <Button variant="ghost">My Library</Button>
              </Link>
              <Button>Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Novel Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Image
                src={novel.cover || "/placeholder.svg"}
                alt={novel.title}
                width={300}
                height={400}
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{novel.title}</h1>
                <p className="text-xl text-muted-foreground mb-4">by {novel.author}</p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{novel.rating}</span>
                    <span className="text-muted-foreground">({novel.totalRatings} ratings)</span>
                  </div>
                  <Badge variant="secondary">{novel.status}</Badge>
                  <span className="text-muted-foreground">{novel.chapters} chapters</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {novel.genre.map((g) => (
                    <Badge key={g} variant="outline">
                      {g}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Link href={`/read/${novel.id}/1`}>
                    <Button size="lg" className="flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Start Reading</span>
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="flex items-center space-x-2">
                    <Bookmark className="h-4 w-4" />
                    <span>Add to Library</span>
                  </Button>
                  <Button size="lg" variant="outline" className="flex items-center space-x-2">
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <div className="prose prose-gray max-w-none">
                  {novel.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {novel.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="font-semibold">{novel.wordCount}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{novel.readingTime}</div>
                  <div className="text-sm text-muted-foreground">Reading Time</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{novel.language}</div>
                  <div className="text-sm text-muted-foreground">Language</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{new Date(novel.lastUpdated).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Chapters</h2>
          <Card>
            <CardContent className="p-0">
              {chapters.map((chapter, index) => (
                <div key={chapter.number}>
                  <Link href={`/read/${novel.id}/${chapter.number}`}>
                    <div className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            Chapter {chapter.number}: {chapter.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{new Date(chapter.publishDate).toLocaleDateString()}</span>
                            <span>{chapter.wordCount.toLocaleString()} words</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read
                        </Button>
                      </div>
                    </div>
                  </Link>
                  {index < chapters.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{review.user}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription>{new Date(review.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
