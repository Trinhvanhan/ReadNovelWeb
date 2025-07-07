import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SearchFilters {
  genres: string[]
  status: string[]
  rating: number
  tags: string[]
  author: string
  sortBy: "relevance" | "rating" | "updated" | "created" | "title"
  sortOrder: "asc" | "desc"
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilters
  createdAt: string
}

interface SearchState {
  query: string
  filters: SearchFilters
  results: any[]
  suggestions: string[]
  recentSearches: string[]
  savedSearches: SavedSearch[]
  isLoading: boolean
  error: string | null
  totalResults: number
  currentPage: number
  hasMore: boolean
}

const initialState: SearchState = {
  query: "",
  filters: {
    genres: [],
    status: [],
    rating: 0,
    tags: [],
    author: "",
    sortBy: "relevance",
    sortOrder: "desc",
  },
  results: [],
  suggestions: [],
  recentSearches: [],
  savedSearches: [],
  isLoading: false,
  error: null,
  totalResults: 0,
  currentPage: 1,
  hasMore: false,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    setResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload
    },
    appendResults: (state, action: PayloadAction<any[]>) => {
      state.results.push(...action.payload)
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim()
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query)
        state.recentSearches = state.recentSearches.slice(0, 10)
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = []
    },
    saveSearch: (state, action: PayloadAction<SavedSearch>) => {
      state.savedSearches.push(action.payload)
    },
    removeSavedSearch: (state, action: PayloadAction<string>) => {
      state.savedSearches = state.savedSearches.filter((s) => s.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setTotalResults: (state, action: PayloadAction<number>) => {
      state.totalResults = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
  },
})

export const {
  setQuery,
  setFilters,
  resetFilters,
  setResults,
  appendResults,
  setSuggestions,
  addRecentSearch,
  clearRecentSearches,
  saveSearch,
  removeSavedSearch,
  setLoading,
  setError,
  setTotalResults,
  setCurrentPage,
  setHasMore,
} = searchSlice.actions

export default searchSlice.reducer
