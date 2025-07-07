import { searchNovels, getAvailableFilters } from "@/lib/search"
import { SearchInterface } from "@/components/search/search-interface"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"

interface SearchPageProps {
  searchParams: {
    q?: string
    genres?: string
    tags?: string
    status?: string
    language?: string
    rating_min?: string
    rating_max?: string
    word_min?: string
    word_max?: string
    sort?: string
    order?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const filters = {
    query: searchParams.q,
    genres: searchParams.genres ? searchParams.genres.split(",") : undefined,
    tags: searchParams.tags ? searchParams.tags.split(",") : undefined,
    status: searchParams.status ? searchParams.status.split(",") : undefined,
    language: searchParams.language ? searchParams.language.split(",") : undefined,
    rating:
      searchParams.rating_min || searchParams.rating_max
        ? {
            min: searchParams.rating_min ? Number.parseFloat(searchParams.rating_min) : 0,
            max: searchParams.rating_max ? Number.parseFloat(searchParams.rating_max) : 5,
          }
        : undefined,
    wordCount:
      searchParams.word_min || searchParams.word_max
        ? {
            min: searchParams.word_min ? Number.parseInt(searchParams.word_min) : 0,
            max: searchParams.word_max ? Number.parseInt(searchParams.word_max) : 1000000,
          }
        : undefined,
    sortBy: (searchParams.sort as any) || "relevance",
    sortOrder: (searchParams.order as any) || "desc",
  }

  const [results, availableFilters] = await Promise.all([searchNovels(filters), getAvailableFilters()])

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
              <Link href="/library">
                <span className="text-sm text-muted-foreground hover:text-foreground">My Library</span>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <SearchInterface initialFilters={filters} initialResults={results} availableFilters={availableFilters} />
      </div>
    </div>
  )
}
