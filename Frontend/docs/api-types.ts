// API Type Definitions for Novel Reader Frontend

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresAt: number
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "admin" | "moderator"
  createdAt: string
  lastLoginAt?: string
  preferences: UserPreferences
  stats?: UserStats
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  autoBookmark: boolean
  notifications: NotificationPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  newChapters: boolean
  recommendations: boolean
}

export interface UserStats {
  novelsRead: number
  chaptersRead: number
  totalReadingTime: number
  favoriteGenres: string[]
}

// Novel Types
export interface Novel {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  genres: string[]
  tags: string[]
  status: "ongoing" | "completed" | "hiatus"
  language: string
  rating: number
  ratingCount: number
  viewCount: number
  favoriteCount: number
  chapterCount: number
  wordCount: number
  lastUpdated: string
  createdAt: string
  isCompleted: boolean
  isPremium: boolean
  chapters?: ChapterSummary[]
  author?: AuthorInfo
  userInteraction?: UserNovelInteraction
}

export interface ChapterSummary {
  number: number
  title: string
  wordCount: number
  publishedAt: string
  isLocked: boolean
}

export interface Chapter {
  id: string
  novelId: string
  number: number
  title: string
  content: string
  wordCount: number
  publishedAt: string
  updatedAt: string
  isLocked: boolean
  navigation: ChapterNavigation
  novel: NovelSummary
}

export interface ChapterNavigation {
  previousChapter?: ChapterSummary
  nextChapter?: ChapterSummary
}

export interface NovelSummary {
  id: string
  title: string
  author: string
  coverImage: string
}

export interface AuthorInfo {
  id: string
  name: string
  avatar?: string
  bio: string
  novelCount: number
  followerCount: number
}

export interface UserNovelInteraction {
  isFavorited: boolean
  isFollowing: boolean
  rating?: number
  lastReadChapter?: number
  readingProgress: number
}

// Reading Progress Types
export interface ReadingProgress {
  novelId: string
  novel: NovelSummary
  currentChapter: number
  currentPosition: number
  lastReadAt: string
  totalReadingTime: number
  progressPercentage: number
  isCompleted: boolean
}

export interface ReadingProgressUpdate {
  novelId: string
  chapterNumber: number
  position: number
  readingTime?: number
}

export interface ReadingStats {
  totalNovels: number
  completedNovels: number
  totalChapters: number
  totalReadingTime: number
  averageReadingSpeed: number
}

export interface ReadingMilestone {
  type: "chapter_milestone" | "time_milestone" | "completion_milestone"
  message: string
  reward?: string
}

// Bookmark Types
export interface Bookmark {
  id: string
  novelId: string
  chapterNumber: number
  position: number
  note?: string
  createdAt: string
  novel: NovelSummary
  chapter: ChapterSummary & { excerpt: string }
}

export interface BookmarkRequest {
  novelId: string
  chapterNumber: number
  position: number
  note?: string
}

// Search Types
export interface SearchFilters {
  genres?: string[]
  status?: string[]
  rating?: [number, number]
  wordCount?: string[]
  language?: string[]
  tags?: string[]
}

export interface SearchRequest {
  query: string
  filters?: SearchFilters
  sortBy?: "relevance" | "rating" | "popularity" | "newest" | "updated"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface SearchResponse {
  results: SearchResult[]
  pagination: Pagination
  searchInfo: SearchInfo
  facets: SearchFacets
}

export interface SearchResult extends Novel {
  relevanceScore: number
  matchedTerms: string[]
  excerpt: string
}

export interface SearchInfo {
  query: string
  executionTime: number
  appliedFilters: SearchFilters
  suggestions: string[]
}

export interface SearchFacets {
  genres: FacetItem[]
  status: FacetItem[]
  language: FacetItem[]
}

export interface FacetItem {
  name: string
  count: number
}

export interface SearchSuggestion {
  text: string
  type: "query" | "novel" | "author"
  id?: string
  author?: string
  coverImage?: string
  novelCount?: number
  popularity?: number
}

// Notification Types
export interface Notification {
  id: string
  type: "new_chapter" | "recommendation" | "system" | "milestone"
  title: string
  message: string
  data: Record<string, any>
  priority: "low" | "medium" | "high"
  isRead: boolean
  createdAt: string
  readAt?: string
  actions: NotificationAction[]
}

export interface NotificationAction {
  type: string
  label: string
  url?: string
}

export interface NotificationSummary {
  unreadCount: number
  totalCount: number
  typeBreakdown: Record<string, number>
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
    }>
    timestamp: string
    requestId: string
  }
}

// Admin Types
export interface AdminStats {
  overview: {
    totalUsers: number
    activeUsers: number
    totalNovels: number
    totalChapters: number
    totalViews: number
    newUsersToday: number
    newNovelsToday: number
  }
  userStats: {
    registrationsThisMonth: number
    activeReadersThisWeek: number
    premiumUsers: number
    userRetentionRate: number
  }
  contentStats: {
    novelsPublishedThisMonth: number
    chaptersPublishedToday: number
    averageRating: number
    topGenres: Array<{ genre: string; count: number }>
  }
  engagementStats: {
    dailyActiveUsers: number
    averageSessionDuration: number
    chaptersReadPerUser: number
    bookmarkRate: number
  }
}

export interface AnalyticsData {
  type: string
  period: string
  dateRange: {
    start: string
    end: string
  }
  data: Array<Record<string, any>>
  summary: Record<string, any>
  trends: Record<string, any>
}

// File Upload Types
export interface FileUploadRequest {
  file: File
  type: "cover" | "avatar" | "document"
  novelId?: string
}

export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
}

// WebSocket Types
export interface WebSocketMessage {
  type: string
  data: Record<string, any>
  timestamp?: string
}

export interface NewChapterEvent {
  type: "new_chapter"
  data: {
    novelId: string
    novelTitle: string
    chapterNumber: number
    chapterTitle: string
    publishedAt: string
  }
}

export interface ProgressSyncEvent {
  type: "progress_sync"
  data: {
    novelId: string
    chapterNumber: number
    position: number
    device: string
    timestamp: string
  }
}

export interface SystemNotificationEvent {
  type: "system_notification"
  data: {
    id: string
    title: string
    message: string
    priority: "low" | "medium" | "high"
    actions: NotificationAction[]
  }
}

// RTK Query Types
export interface NovelFilters {
  page?: number
  limit?: number
  genre?: string
  status?: string
  language?: string
  sortBy?: string
  sortOrder?: string
}

export interface NovelListResponse {
  novels: Novel[]
  pagination: Pagination
  filters: {
    availableGenres: string[]
    availableLanguages: string[]
    availableStatuses: string[]
  }
}

// Rate Limiting Types
export interface RateLimitHeaders {
  "X-RateLimit-Limit": string
  "X-RateLimit-Remaining": string
  "X-RateLimit-Reset": string
  "X-RateLimit-Window": string
}

// Configuration Types
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

export interface WebSocketConfig {
  url: string
  reconnectInterval: number
  maxReconnectAttempts: number
}
