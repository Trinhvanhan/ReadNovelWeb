export interface SearchParams {
  q?: string;
  genres?: string;
  status?: string;
  rating_min?: number;
  rating_max?: number;
  chapter_min?: number;
  chapter_max?: number;
  tags?: string;
  sortBy?: 'relevance' | 'rating' | 'popularity' | 'newest' | 'updated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchFilter {
  q?: string;
  genres?: string[];
  status?: string;
  rating?: [number, number];
  chapterCount?: [number, number];
  tags?: string[];
  sortBy?: 'relevance' | 'rating' | 'popularity' | 'newest' | 'updated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string
  title: string
  author: string
  coverImage?: string
  rating: number
  chapters: number
  status: string
  genres: string[]
  tags: string[]
  description: string
  wordCount: string
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
  filters?: SearchParams
  clickedResults?: string[]
}