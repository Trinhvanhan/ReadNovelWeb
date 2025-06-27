export interface SearchFilters {
  query?: string
  genres?: string[]
  tags?: string[]
  status?: string[]
  language?: string[]
  rating?: { min: number; max: number }
  wordCount?: { min: number; max: number }
  sortBy?: "relevance" | "rating" | "popularity" | "newest" | "updated"
  sortOrder?: "asc" | "desc"
}

export interface SearchResult {
  id: string
  title: string
  author: string
  cover?: string
  rating: number
  totalRatings: number
  chapters: number
  status: string
  genre: string[]
  tags: string[]
  description: string
  wordCount: string
  language: string
  lastUpdated: string
  relevanceScore: number
}

export interface SearchSuggestion {
  type: "novel" | "author" | "genre" | "tag"
  text: string
  count?: number
}

export interface SearchAnalytics {
  query: string
  resultsCount: number
  userId?: string
  timestamp: string
  filters?: SearchFilters
  clickedResults?: string[]
}

// Mock data for search - in a real app, this would be from a database with full-text search
const searchableNovels = [
  {
    id: "1",
    title: "The Midnight Chronicles",
    author: "Sarah Chen",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    totalRatings: 2847,
    chapters: 45,
    status: "ongoing",
    genre: ["Fantasy", "Adventure"],
    tags: ["Strong Female Lead", "Magic System", "Epic Fantasy", "Coming of Age"],
    description:
      "In a world where darkness threatens to consume everything, young Aria discovers she possesses an ancient power that could either save her realm or destroy it completely. As the last heir to the Midnight Throne, she must navigate treacherous political alliances, master her newfound abilities, and uncover the truth about her family's mysterious past.",
    wordCount: "450000",
    language: "English",
    lastUpdated: "2024-01-15",
    publishedDate: "2023-06-15",
  },
  {
    id: "2",
    title: "Digital Hearts",
    author: "Alex Rivera",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    totalRatings: 1523,
    chapters: 32,
    status: "completed",
    genre: ["Sci-Fi", "Romance"],
    tags: ["Virtual Reality", "AI", "Love Story", "Technology"],
    description:
      "Love blooms in the digital age as two programmers navigate virtual reality and real emotions. When Maya and Jake meet in a virtual world, their connection transcends the boundaries between digital and reality.",
    wordCount: "320000",
    language: "English",
    lastUpdated: "2023-12-10",
    publishedDate: "2023-08-20",
  },
  {
    id: "3",
    title: "The Last Library",
    author: "Emma Thompson",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    totalRatings: 3421,
    chapters: 28,
    status: "completed",
    genre: ["Dystopian", "Drama"],
    tags: ["Books", "Rebellion", "Knowledge", "Hope"],
    description:
      "In a world where books are forbidden, one librarian fights to preserve human knowledge. Elena risks everything to save the last remaining books from destruction in this powerful tale of resistance and hope.",
    wordCount: "280000",
    language: "English",
    lastUpdated: "2024-01-20",
    publishedDate: "2023-09-10",
  },
  {
    id: "4",
    title: "Quantum Dreams",
    author: "Dr. Michael Park",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    totalRatings: 1876,
    chapters: 56,
    status: "ongoing",
    genre: ["Sci-Fi", "Thriller"],
    tags: ["Quantum Physics", "Time Travel", "Science", "Mystery"],
    description:
      "When physicist Dr. Sarah Kim discovers a way to enter quantum dreams, she uncovers a conspiracy that threatens the fabric of reality itself. A mind-bending journey through parallel universes and quantum mechanics.",
    wordCount: "560000",
    language: "English",
    lastUpdated: "2024-01-18",
    publishedDate: "2023-05-15",
  },
  {
    id: "5",
    title: "The Phoenix Rebellion",
    author: "Lisa Wang",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.5,
    totalRatings: 2156,
    chapters: 41,
    status: "ongoing",
    genre: ["Fantasy", "Action"],
    tags: ["Dragons", "Magic", "War", "Friendship"],
    description:
      "When dragons return to the world after a thousand years, young Kai must unite the scattered clans to face an ancient evil. An epic tale of friendship, sacrifice, and the power of unity.",
    wordCount: "410000",
    language: "English",
    lastUpdated: "2024-01-12",
    publishedDate: "2023-07-22",
  },
  {
    id: "6",
    title: "Echoes of Tomorrow",
    author: "James Mitchell",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    totalRatings: 1654,
    chapters: 33,
    status: "completed",
    genre: ["Sci-Fi", "Mystery"],
    tags: ["Future", "AI", "Detective", "Cyberpunk"],
    description:
      "In 2087, detective Marcus Cole investigates a series of murders that seem to predict the future. A cyberpunk thriller that explores the intersection of technology and human nature.",
    wordCount: "330000",
    language: "English",
    lastUpdated: "2023-11-30",
    publishedDate: "2023-04-18",
  },
]

// Mock search analytics storage
const searchAnalytics: SearchAnalytics[] = []

export async function searchNovels(filters: SearchFilters): Promise<SearchResult[]> {
  let results = [...searchableNovels]

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase()
    results = results.filter((novel) => {
      const searchText =
        `${novel.title} ${novel.author} ${novel.description} ${novel.genre.join(" ")} ${novel.tags.join(" ")}`.toLowerCase()
      return searchText.includes(query)
    })

    // Calculate relevance score
    results = results.map((novel) => {
      let score = 0
      const query = filters.query!.toLowerCase()

      // Title match (highest weight)
      if (novel.title.toLowerCase().includes(query)) score += 10
      // Author match
      if (novel.author.toLowerCase().includes(query)) score += 8
      // Genre match
      if (novel.genre.some((g) => g.toLowerCase().includes(query))) score += 6
      // Tag match
      if (novel.tags.some((t) => t.toLowerCase().includes(query))) score += 4
      // Description match
      if (novel.description.toLowerCase().includes(query)) score += 2

      return { ...novel, relevanceScore: score }
    })
  } else {
    results = results.map((novel) => ({ ...novel, relevanceScore: 0 }))
  }

  // Genre filter
  if (filters.genres && filters.genres.length > 0) {
    results = results.filter((novel) => filters.genres!.some((genre) => novel.genre.includes(genre)))
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((novel) => filters.tags!.some((tag) => novel.tags.includes(tag)))
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    results = results.filter((novel) => filters.status!.includes(novel.status))
  }

  // Language filter
  if (filters.language && filters.language.length > 0) {
    results = results.filter((novel) => filters.language!.includes(novel.language))
  }

  // Rating filter
  if (filters.rating) {
    results = results.filter((novel) => novel.rating >= filters.rating!.min && novel.rating <= filters.rating!.max)
  }

  // Word count filter
  if (filters.wordCount) {
    results = results.filter((novel) => {
      const wordCount = Number.parseInt(novel.wordCount)
      return wordCount >= filters.wordCount!.min && wordCount <= filters.wordCount!.max
    })
  }

  // Sorting
  const sortBy = filters.sortBy || "relevance"
  const sortOrder = filters.sortOrder || "desc"

  results.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "relevance":
        comparison = b.relevanceScore - a.relevanceScore
        break
      case "rating":
        comparison = b.rating - a.rating
        break
      case "popularity":
        comparison = b.totalRatings - a.totalRatings
        break
      case "newest":
        comparison = new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
        break
      case "updated":
        comparison = new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        break
    }

    return sortOrder === "asc" ? -comparison : comparison
  })

  return results
}

export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (!query || query.length < 2) return []

  const suggestions: SearchSuggestion[] = []
  const queryLower = query.toLowerCase()

  // Novel suggestions
  searchableNovels.forEach((novel) => {
    if (novel.title.toLowerCase().includes(queryLower)) {
      suggestions.push({
        type: "novel",
        text: novel.title,
      })
    }
  })

  // Author suggestions
  const authors = [...new Set(searchableNovels.map((n) => n.author))]
  authors.forEach((author) => {
    if (author.toLowerCase().includes(queryLower)) {
      suggestions.push({
        type: "author",
        text: author,
        count: searchableNovels.filter((n) => n.author === author).length,
      })
    }
  })

  // Genre suggestions
  const genres = [...new Set(searchableNovels.flatMap((n) => n.genre))]
  genres.forEach((genre) => {
    if (genre.toLowerCase().includes(queryLower)) {
      suggestions.push({
        type: "genre",
        text: genre,
        count: searchableNovels.filter((n) => n.genre.includes(genre)).length,
      })
    }
  })

  // Tag suggestions
  const tags = [...new Set(searchableNovels.flatMap((n) => n.tags))]
  tags.forEach((tag) => {
    if (tag.toLowerCase().includes(queryLower)) {
      suggestions.push({
        type: "tag",
        text: tag,
        count: searchableNovels.filter((n) => n.tags.includes(tag)).length,
      })
    }
  })

  // Limit and sort suggestions
  return suggestions.slice(0, 10).sort((a, b) => {
    // Prioritize exact matches and novels
    const aExact = a.text.toLowerCase() === queryLower
    const bExact = b.text.toLowerCase() === queryLower
    if (aExact && !bExact) return -1
    if (!aExact && bExact) return 1

    const typeOrder = { novel: 0, author: 1, genre: 2, tag: 3 }
    return typeOrder[a.type] - typeOrder[b.type]
  })
}

export async function logSearchAnalytics(analytics: Omit<SearchAnalytics, "timestamp">): Promise<void> {
  searchAnalytics.push({
    ...analytics,
    timestamp: new Date().toISOString(),
  })
}

export async function getSearchAnalytics(): Promise<{
  totalSearches: number
  topQueries: { query: string; count: number }[]
  topGenres: { genre: string; count: number }[]
  averageResultsPerSearch: number
  searchTrends: { date: string; searches: number }[]
}> {
  const totalSearches = searchAnalytics.length

  // Top queries
  const queryCount = searchAnalytics.reduce(
    (acc, search) => {
      acc[search.query] = (acc[search.query] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topQueries = Object.entries(queryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }))

  // Top genres (from filters)
  const genreCount = searchAnalytics.reduce(
    (acc, search) => {
      if (search.filters?.genres) {
        search.filters.genres.forEach((genre) => {
          acc[genre] = (acc[genre] || 0) + 1
        })
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([genre, count]) => ({ genre, count }))

  // Average results per search
  const averageResultsPerSearch =
    totalSearches > 0 ? searchAnalytics.reduce((sum, search) => sum + search.resultsCount, 0) / totalSearches : 0

  // Search trends (last 7 days)
  const searchTrends = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const searches = searchAnalytics.filter((search) => search.timestamp.startsWith(dateStr)).length

    return { date: dateStr, searches }
  }).reverse()

  return {
    totalSearches,
    topQueries,
    topGenres,
    averageResultsPerSearch,
    searchTrends,
  }
}

export async function getAvailableFilters() {
  const genres = [...new Set(searchableNovels.flatMap((n) => n.genre))].sort()
  const tags = [...new Set(searchableNovels.flatMap((n) => n.tags))].sort()
  const languages = [...new Set(searchableNovels.map((n) => n.language))].sort()
  const statuses = [...new Set(searchableNovels.map((n) => n.status))].sort()

  return {
    genres,
    tags,
    languages,
    statuses,
  }
}
