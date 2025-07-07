import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../index"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.user
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["User", "Novel", "Chapter", "Progress", "Bookmark", "Search"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<{ user: any; sessionExpiry: number }, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation<{ user: any; sessionExpiry: number }, { email: string; password: string; name: string }>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Novel endpoints
    getNovels: builder.query<any[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => `/novels?page=${page}&limit=${limit}`,
      providesTags: ["Novel"],
    }),
    getNovel: builder.query<any, string>({
      query: (id) => `/novels/${id}`,
      providesTags: (result, error, id) => [{ type: "Novel", id }],
    }),
    getChapter: builder.query<any, { novelId: string; chapterNumber: number }>({
      query: ({ novelId, chapterNumber }) => `/novels/${novelId}/chapters/${chapterNumber}`,
      providesTags: (result, error, { novelId, chapterNumber }) => [
        { type: "Chapter", id: `${novelId}-${chapterNumber}` },
      ],
    }),

    // Reading progress endpoints
    updateProgress: builder.mutation<void, { novelId: string; chapterNumber: number; position: number }>({
      query: (progress) => ({
        url: "/reading/progress",
        method: "POST",
        body: progress,
      }),
      invalidatesTags: ["Progress"],
    }),
    getProgress: builder.query<any[], void>({
      query: () => "/reading/progress",
      providesTags: ["Progress"],
    }),

    // Bookmark endpoints
    addBookmark: builder.mutation<void, { novelId: string; chapterNumber: number; position: number; note?: string }>({
      query: (bookmark) => ({
        url: "/reading/bookmarks",
        method: "POST",
        body: bookmark,
      }),
      invalidatesTags: ["Bookmark"],
    }),
    getBookmarks: builder.query<any[], void>({
      query: () => "/reading/bookmarks",
      providesTags: ["Bookmark"],
    }),

    // Search endpoints
    searchNovels: builder.query<
      { results: any[]; total: number; hasMore: boolean },
      { query: string; filters?: any; page?: number; limit?: number }
    >({
      query: ({ query, filters, page = 1, limit = 20 }) => ({
        url: "/search",
        params: { q: query, ...filters, page, limit },
      }),
      providesTags: ["Search"],
    }),
    getSuggestions: builder.query<string[], string>({
      query: (query) => `/search/suggestions?q=${query}`,
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useGetCurrentUserQuery,
  useGetNovelsQuery,
  useGetNovelQuery,
  useGetChapterQuery,
  useUpdateProgressMutation,
  useGetProgressQuery,
  useAddBookmarkMutation,
  useGetBookmarksQuery,
  useSearchNovelsQuery,
  useGetSuggestionsQuery,
} = apiSlice
