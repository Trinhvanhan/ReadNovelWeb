import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Star, Bookmark, Play, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SearchBar } from "@/components/search/search-bar"
import { InteractiveButton } from "@/components/novel/interactive-button"
import type { Novel } from "@/lib/apis/types/data.type"
import { getNovelById } from "@/lib/apis/novel.api"
import { notFound } from "next/navigation"
import ChapterList from "@/components/novel/chapter-list"

// Mock data - in a real app, this would come from an API


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

interface NovelDetailPageProps {
  params: { id: string }
}

export default async function NovelDetailPage({ params }: NovelDetailPageProps) {
  const { id } = await params
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  const cookieString = tokenCookie ? `token=${tokenCookie.value}` : '';
  const result = await getNovelById(id, cookieString)
  const novel = result.data as Novel

  if(result.status) {
  } else return notFound()

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
                src={novel.coverImage || "/placeholder.svg"}
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
                <p className="text-xl text-muted-foreground mb-4">by {novel.author.name}</p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{novel.rating.average.toFixed(1)}</span>
                    <span className="text-muted-foreground">({novel.rating.count} ratings)</span>
                  </div>
                  <Badge variant="secondary">{novel.status}</Badge>
                  <span className="text-muted-foreground">{novel.chapters.length} chapters</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {novel.genres.map((g) => (
                    <Badge key={g.name} variant="outline">
                      {g.name}
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
                  <InteractiveButton novelId={id} typeInteraction="follow" isActived={novel.userInteraction.isFollowing}>
                    <Bookmark className="h-4 w-4" />
                    <span>Follow</span>
                  </InteractiveButton>

                  <InteractiveButton novelId={id} typeInteraction="favorite" isActived={novel.userInteraction.isFavorited}>
                    <Heart className="h-4 w-4" />
                    <span>Favorite</span>
                  </InteractiveButton>
                  
                  <InteractiveButton novelId={id} typeInteraction="feature" isActived={novel.userInteraction.isFeatured}>
                    <Star className="h-4 w-4" />
                    <span>Feature</span>
                  </InteractiveButton>
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

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="font-semibold">{novel.views}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{novel.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{novel.favorites}</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{novel.features}</div>
                  <div className="text-sm text-muted-foreground">Features</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{new Date(novel.updatedAt).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <ChapterList chapters={novel.chapters} novelId={novel.id} />
        

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
