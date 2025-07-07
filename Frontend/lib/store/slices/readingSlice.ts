import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Novel {
  id: string
  title: string
  author: string
  description: string
  coverImage?: string
  genres: string[]
  status: "ongoing" | "completed" | "hiatus"
  totalChapters: number
  rating: number
  tags: string[]
}

export interface Chapter {
  id: string
  novelId: string
  number: number
  title: string
  content: string
  publishedAt: string
  wordCount: number
}

export interface ReadingProgress {
  novelId: string
  chapterNumber: number
  position: number
  lastReadAt: string
}

export interface Bookmark {
  id: string
  novelId: string
  chapterNumber: number
  position: number
  note?: string
  createdAt: string
}

interface ReadingState {
  currentNovel: Novel | null
  currentChapter: Chapter | null
  readingProgress: Record<string, ReadingProgress>
  bookmarks: Bookmark[]
  favorites: string[]
  recentlyRead: Novel[]
  readingSettings: {
    fontSize: number
    fontFamily: string
    lineHeight: number
    backgroundColor: string
    textColor: string
    autoScroll: boolean
    scrollSpeed: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: ReadingState = {
  currentNovel: null,
  currentChapter: null,
  readingProgress: {},
  bookmarks: [],
  favorites: [],
  recentlyRead: [],
  readingSettings: {
    fontSize: 16,
    fontFamily: "Inter",
    lineHeight: 1.6,
    backgroundColor: "#ffffff",
    textColor: "#000000",
    autoScroll: false,
    scrollSpeed: 1,
  },
  isLoading: false,
  error: null,
}

const readingSlice = createSlice({
  name: "reading",
  initialState,
  reducers: {
    setCurrentNovel: (state, action: PayloadAction<Novel>) => {
      state.currentNovel = action.payload
      // Add to recently read if not already there
      const existingIndex = state.recentlyRead.findIndex((n) => n.id === action.payload.id)
      if (existingIndex >= 0) {
        state.recentlyRead.splice(existingIndex, 1)
      }
      state.recentlyRead.unshift(action.payload)
      // Keep only last 10 recently read
      state.recentlyRead = state.recentlyRead.slice(0, 10)
    },
    setCurrentChapter: (state, action: PayloadAction<Chapter>) => {
      state.currentChapter = action.payload
    },
    updateReadingProgress: (state, action: PayloadAction<ReadingProgress>) => {
      state.readingProgress[action.payload.novelId] = action.payload
    },
    addBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.bookmarks.push(action.payload)
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter((b) => b.id !== action.payload)
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const novelId = action.payload
      const index = state.favorites.indexOf(novelId)
      if (index >= 0) {
        state.favorites.splice(index, 1)
      } else {
        state.favorites.push(novelId)
      }
    },
    updateReadingSettings: (state, action: PayloadAction<Partial<ReadingState["readingSettings"]>>) => {
      state.readingSettings = { ...state.readingSettings, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setCurrentNovel,
  setCurrentChapter,
  updateReadingProgress,
  addBookmark,
  removeBookmark,
  toggleFavorite,
  updateReadingSettings,
  setLoading,
  setError,
} = readingSlice.actions

export default readingSlice.reducer
