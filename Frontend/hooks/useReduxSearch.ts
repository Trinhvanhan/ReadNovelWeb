"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  setQuery,
  setFilters,
  resetFilters,
  addRecentSearch,
  saveSearch,
  removeSavedSearch,
} from "@/lib/store/slices/searchSlice"
import type { SearchFilters, SavedSearch } from "@/lib/store/slices/searchSlice"

export function useReduxSearch() {
  const dispatch = useAppDispatch()
  const searchState = useAppSelector((state) => state.search)

  const updateQuery = useCallback(
    (query: string) => {
      dispatch(setQuery(query))
    },
    [dispatch],
  )

  const updateFilters = useCallback(
    (filters: Partial<SearchFilters>) => {
      dispatch(setFilters(filters))
    },
    [dispatch],
  )

  const clearFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  const addToRecentSearches = useCallback(
    (query: string) => {
      dispatch(addRecentSearch(query))
    },
    [dispatch],
  )

  const saveCurrentSearch = useCallback(
    (name: string) => {
      const savedSearch: SavedSearch = {
        id: Date.now().toString(),
        name,
        query: searchState.query,
        filters: searchState.filters,
        createdAt: new Date().toISOString(),
      }
      dispatch(saveSearch(savedSearch))
    },
    [dispatch, searchState],
  )

  const deleteSavedSearch = useCallback(
    (id: string) => {
      dispatch(removeSavedSearch(id))
    },
    [dispatch],
  )

  return {
    ...searchState,
    updateQuery,
    updateFilters,
    clearFilters,
    addToRecentSearches,
    saveCurrentSearch,
    deleteSavedSearch,
  }
}
