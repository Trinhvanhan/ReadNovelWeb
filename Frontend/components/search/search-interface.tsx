"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { searchNovels, logSearchAnalytics } from "@/lib/search"
import type { SearchFilters, SearchResult } from "@/lib/search"
import { debounce } from "lodash"

interface SearchInterfaceProps {
  initialFilters: SearchFilters
  initialResults: SearchResult[]
  availableFilters: {
    genres: string[]
    tags: string[]
    languages: string[]
    statuses: string[]
  }
}

export function SearchInterface({ initialFilters, initialResults, availableFilters }: SearchInterfaceProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialFilters.query || "")
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [results, setResults] = useState<SearchResult[]>(initialResults)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchFilters) => {
      setIsLoading(true)
      try {
        const searchResults = await searchNovels(searchFilters)
        setResults(searchResults)

        // Log search analytics
        await logSearchAnalytics({
          query: searchFilters.query || "",
          resultsCount: searchResults.length,
          filters: searchFilters,
        })

        // Update URL
        const params = new URLSearchParams()
        if (searchFilters.query) params.set("q", searchFilters.query)
        if (searchFilters.genres?.length) params.set("genres", searchFilters.genres.join(","))
        if (searchFilters.tags?.length) params.set("tags", searchFilters.tags.join(","))
        if (searchFilters.status?.length) params.set("status", searchFilters.status.join(","))
        if (searchFilters.language?.length) params.set("language", searchFilters.language.join(","))
        if (searchFilters.rating) {
          params.set("rating_min", searchFilters.rating.min.toString())
          params.set("rating_max", searchFilters.rating.max.toString())
        }
        if (searchFilters.wordCount) {
          params.set("word_min", searchFilters.wordCount.min.toString())
          params.set("word_max", searchFilters.wordCount.max.toString())
        }
        if (searchFilters.sortBy && searchFilters.sortBy !== "relevance") {
          params.set("sort", searchFilters.sortBy)
        }
        if (searchFilters.sortOrder && searchFilters.sortOrder !== "desc") {
          params.set("order", searchFilters.sortOrder)
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
    debouncedSearch(filters)
  }, [filters, debouncedSearch])

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
    setFilters((prev) => ({ ...prev, query: newQuery }))
    setShowSuggestions(newQuery.length > 0)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilter = (key: keyof SearchFilters) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setQuery("")
    setFilters({ query: "" })
  }

  const activeFilterCount =
    Object.keys(filters).filter((key) => {
      const value = filters[key as keyof SearchFilters]
      return value && (Array.isArray(value) ? value.length > 0 : true)
    }).length - (filters.query ? 1 : 0) // Don't count query as a filter

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
            {filters.status?.map((status) => (
              <Badge key={status} variant="secondary" className="cursor-pointer">
                {status}
                <X
                  className="h-3 w-3 ml-1"
                  onClick={() =>
                    handleFilterChange(
                      "status",
                      filters.status?.filter((s) => s !== status),
                    )
                  }
                />
              </Badge>
            ))}
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
                          type="checkbox"
                          checked={filters.status?.includes(status) || false}
                          onChange={(e) => {
                            const currentStatus = filters.status || []
                            if (e.target.checked) {
                              handleFilterChange("status", [...currentStatus, status])
                            } else {
                              handleFilterChange(
                                "status",
                                currentStatus.filter((s) => s !== status),
                              )
                            }
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
                    value={[filters.rating?.min || 0]}
                    onValueChange={([value]) =>
                      handleFilterChange("rating", {
                        min: value,
                        max: filters.rating?.max || 5,
                      })
                    }
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>{filters.rating?.min?.toFixed(1) || "0.0"}+</span>
                    <span>5</span>
                  </div>
                </div>

                <Separator />

                {/* Word Count */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Word Count</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="wordCount"
                        checked={!filters.wordCount}
                        onChange={() => clearFilter("wordCount")}
                      />
                      <span className="text-sm">Any length</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="wordCount"
                        checked={filters.wordCount?.min === 0 && filters.wordCount?.max === 100000}
                        onChange={() => handleFilterChange("wordCount", { min: 0, max: 100000 })}
                      />
                      <span className="text-sm">Short (&lt; 100k words)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="wordCount"
                        checked={filters.wordCount?.min === 100000 && filters.wordCount?.max === 300000}
                        onChange={() => handleFilterChange("wordCount", { min: 100000, max: 300000 })}
                      />
                      <span className="text-sm">Medium (100k - 300k words)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="wordCount"
                        checked={filters.wordCount?.min === 300000}
                        onChange={() => handleFilterChange("wordCount", { min: 300000, max: 1000000 })}
                      />
                      <span className="text-sm">Long (&gt; 300k words)</span>
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
                      src={novel.cover || "/placeholder.svg"}
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
                    <div className="flex flex-wrap gap-1 mb-4">
                      {novel.genre.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{novel.chapters} chapters</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(novel.lastUpdated).toLocaleDateString()}</span>
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
