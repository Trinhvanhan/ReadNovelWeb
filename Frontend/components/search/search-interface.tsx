"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, X, Star, BookOpen, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SearchSuggestions } from "./search-suggestions"
import { logSearchAnalytics } from "@/lib/search"
import { getSearchResults } from "@/lib/apis/search.api"
import type { SearchParams, SearchFilter } from "@/lib/apis/types/param.type"
import type { SearchResult } from "@/lib/apis/types/data.type"
import { debounce } from "lodash"

interface SearchInterfaceProps {
  initialFilters: SearchFilter
  initialResults: SearchResult[]
  availableFilters: {
    genres: string[]
    tags: string[]
    statuses: string[]
  }
}

export function SearchInterface({ initialFilters, initialResults, availableFilters }: SearchInterfaceProps) {
  const router = useRouter()

  const [query, setQuery] = useState(initialFilters.q || "")
  const [filters, setFilters] = useState<SearchFilter>(initialFilters)
  const [results, setResults] = useState<SearchResult[]>(initialResults)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchParams) => {
      setIsLoading(true)
      try {
        const searchResults = await getSearchResults(searchFilters)
        setResults(searchResults.data)

        // Log search analytics
        // await logSearchAnalytics({
        //   query: searchFilters.q || "",
        //   resultsCount: searchResults.data.length,
        //   // filters: searchFilters,
        // })

        // Update URL
        const params = new URLSearchParams()
        if (searchFilters.q) params.set("q", searchFilters.q)
        if (searchFilters.sortBy && searchFilters.sortBy !== "relevance") {
          params.set("sort", searchFilters.sortBy)
        }
        if (searchFilters.sortOrder && searchFilters.sortOrder !== "desc") {
          params.set("order", searchFilters.sortOrder)
        }
        if (searchFilters.genres?.length) params.set("genres", searchFilters.genres)
        if (searchFilters.tags?.length) params.set("tags", searchFilters.tags)
        if (searchFilters.status) params.set("status", searchFilters.status)
        if (searchFilters.rating_min) {
          params.set("rating_min", searchFilters.rating_min.toString())
        }
        if (searchFilters.rating_max) {
          params.set("rating_max", searchFilters.rating_max.toString())
        }
        if (searchFilters.chapter_min) {
          params.set("chapter_min", searchFilters.chapter_min.toString())
        }
        if (searchFilters.chapter_max) {
          params.set("chapter_max", searchFilters.chapter_max.toString())
        }

        router.push(`/search?${params.toString()}`, { scroll: false })
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [router],
  )

  // Handle search
  useEffect(() => {
    const params: SearchParams = {
      q: filters.q,
      genres: filters.genres?.join(','),
      status: filters.status,
      rating_min: filters.rating?.[0],
      rating_max: filters.rating?.[1],
      chapter_min: filters.chapterCount?.[0],
      chapter_max: filters.chapterCount?.[1],
      tags: filters.tags?.join(','),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: filters.page,
      limit: filters.limit

    }
    debouncedSearch(params)
  }, [filters, debouncedSearch])

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
    setFilters((prev) => ({ ...prev, query: newQuery }))
    setShowSuggestions(newQuery.length > 0)
  }

  const handleFilterChange = (key: keyof SearchFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilter = (key: keyof SearchFilter) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setQuery("")
    setFilters({ q: "" })
  }

  const activeFilterCount =
    Object.keys(filters).filter((key) => {
      const value = filters[key as keyof SearchFilter]
      return value && (Array.isArray(value) ? value.length > 0 : true)
    }).length - (filters.q ? 1 : 0) // Don't count query as a filter

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Search Novels</h1>
          <Badge variant="secondary">{results.length} results</Badge>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search novels, authors, genres..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setShowSuggestions(query.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 pr-4 h-12 text-lg"
            />
          </div>

          {showSuggestions && (
            <SearchSuggestions
              query={query}
              onSelect={(suggestion) => {
                setQuery(suggestion)
                handleQueryChange(suggestion)
                setShowSuggestions(false)
              }}
            />
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearAllFilters} className="text-muted-foreground">
                Clear all
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="sort" className="text-sm">
              Sort by:
            </Label>
            <Select
              value={filters.sortBy || "relevance"}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.genres?.map((genre) => (
              <Badge key={genre} variant="secondary" className="cursor-pointer">
                {genre}
                <X
                  className="h-3 w-3 ml-1"
                  onClick={() =>
                    handleFilterChange(
                      "genres",
                      filters.genres?.filter((g) => g !== genre),
                    )
                  }
                />
              </Badge>
            ))}
            {filters.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer">
                {tag}
                <X
                  className="h-3 w-3 ml-1"
                  onClick={() =>
                    handleFilterChange(
                      "tags",
                      filters.tags?.filter((t) => t !== tag),
                    )
                  }
                />
              </Badge>
            ))}
            
            <Badge variant="secondary" className="cursor-pointer">
              {filters.status}
              <X
                className="h-3 w-3 ml-1"
                onClick={() =>
                  handleFilterChange(
                    "status",
                    filters.status,
                  )
                }
              />
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Genres */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Genres</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableFilters.genres.map((genre) => (
                      <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.genres?.includes(genre) || false}
                          onChange={(e) => {
                            const currentGenres = filters.genres || []
                            if (e.target.checked) {
                              handleFilterChange("genres", [...currentGenres, genre])
                            } else {
                              handleFilterChange(
                                "genres",
                                currentGenres.filter((g) => g !== genre),
                              )
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <div className="space-y-2">
                    {availableFilters.statuses.map((status) => (
                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={filters.status == status || false}
                          onChange={(e) => {
                            handleFilterChange("status", status)
                          }}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Minimum Rating</Label>
                  <Slider
                    value={[filters.rating?.[0] || 0]}
                    onValueChange={([value]) =>
                      handleFilterChange("rating", [value, 5])
                    }
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>{filters.rating?.[0]?.toFixed(1) || "0.0"}+</span>
                    <span>5</span>
                  </div>
                </div>

                <Separator />

                {/* Word Count */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Chapter Count</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="chapterCount"
                        checked={!filters.chapterCount}
                        onChange={() => clearFilter("chapterCount")}
                      />
                      <span className="text-sm">Any length</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="chapterCount"
                        checked={filters.chapterCount?.[0] === 0 && filters.chapterCount[1] === 100}
                        onChange={() => handleFilterChange("chapterCount", [0, 100])}
                      />
                      <span className="text-sm">Short (&lt; 100 chapters)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="chapterCount"
                        checked={filters.chapterCount?.[0] === 100 && filters.chapterCount[1] === 300}
                        onChange={() => handleFilterChange("chapterCount", [100, 300])}
                      />
                      <span className="text-sm">Medium (100 - 300 chapters)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="chapterCount"
                        checked={filters.chapterCount?.[0] === 300}
                        onChange={() => handleFilterChange("chapterCount", [300, 10000])}
                      />
                      <span className="text-sm">Long (&gt; 300 chapters)</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-4" />
                    <div className="h-8 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No novels found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters to find more results.
                </p>
                <Button onClick={clearAllFilters}>Clear all filters</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((novel) => (
                <Card key={novel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={novel.coverImage || "/placeholder.svg"}
                      alt={novel.title}
                      width={200}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 capitalize">{novel.status}</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">{novel.title}</CardTitle>
                        <CardDescription className="line-champ-1">by {novel.author}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{novel.rating.average.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-justify text-muted-foreground mb-4 line-clamp-2">{novel.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {novel.genres.slice(0,2).map((genre) => (
                        <Badge key={genre.name} variant="secondary" className="text-xs">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{novel.chapters} chapters</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(novel.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/novel/${novel.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
