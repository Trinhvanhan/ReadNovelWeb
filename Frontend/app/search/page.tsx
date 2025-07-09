import { getAvailableFilters } from "@/lib/search"
import { SearchInterface } from "@/components/search/search-interface"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"
import { getSearchResults } from "@/lib/apis/search.api"
import type { SearchParams, SearchFilter } from "@/lib/apis/types/param.type"


interface SearchPageProps {
  searchParams: SearchParams
}


export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, genres, status, rating_min, rating_max, chapter_min, chapter_max, tags, sortBy, sortOrder, page, limit} = await searchParams
  // const params = {
  //   q: q,
  //   genres: genres?.join(','),
  //   status: status,
  //   rating_min: rating?.[0],
  //   rating_max: rating?.[0],
  //   chapter_min: chapterCount?.[0],
  //   chapter_max: chapterCount?.[1],
  //   tags: tags?.join(','),
  //   sortBy: (sortBy as any) || "relevance",
  //   sortOrder: (sortOrder as any) || "desc",
  //   page: page,
  //   limit: limit
  // }
  const searchFilter: SearchFilter = {
    q,
    genres: typeof genres === 'string' ? genres.split(',') : [],
    status: typeof status === 'string' ? status : undefined,
    rating: [
      rating_min != null ? Number(rating_min) : 0,
      rating_max != null ? Number(rating_max) : 5
    ],
    chapterCount: [
      chapter_min != null ? Number(chapter_min) : 0,
      chapter_max != null ? Number(chapter_max) : Infinity
    ],
    tags: typeof tags === 'string' ? tags.split(',') : [],
    sortBy: sortBy || 'relevance',
    sortOrder: sortOrder || 'desc',
    page: Number(page) || 1,
    limit: Number(limit) || 20
  };
  const [results, availableFilters] = await Promise.all([getSearchResults(searchParams), getAvailableFilters()])
  if(!results.data) results.data = []
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
        <SearchInterface initialFilters={searchFilter} initialResults={results.data} availableFilters={availableFilters} />
      </div>
    </div>
  )
}
