"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { useUpdateProgressMutation, useAddBookmarkMutation } from "@/lib/store/api/apiSlice"
import {
  setCurrentNovel,
  setCurrentChapter,
  updateReadingProgress,
  addBookmark,
  toggleFavorite,
} from "@/lib/store/slices/readingSlice"
import type { Novel, Chapter, ReadingProgress, Bookmark } from "@/lib/store/slices/readingSlice"

export function useReduxReading() {
  const dispatch = useAppDispatch()
  const readingState = useAppSelector((state) => state.reading)
  const [updateProgressMutation] = useUpdateProgressMutation()
  const [addBookmarkMutation] = useAddBookmarkMutation()

  const setNovel = useCallback(
    (novel: Novel) => {
      dispatch(setCurrentNovel(novel))
    },
    [dispatch],
  )

  const setChapter = useCallback(
    (chapter: Chapter) => {
      dispatch(setCurrentChapter(chapter))
    },
    [dispatch],
  )

  const updateProgress = useCallback(
    async (progress: ReadingProgress) => {
      dispatch(updateReadingProgress(progress))
      try {
        await updateProgressMutation({
          novelId: progress.novelId,
          chapterNumber: progress.chapterNumber,
          position: progress.position,
        }).unwrap()
      } catch (error) {
        console.error("Failed to sync progress:", error)
      }
    },
    [dispatch, updateProgressMutation],
  )

  const createBookmark = useCallback(
    async (bookmark: Omit<Bookmark, "id" | "createdAt">) => {
      const newBookmark: Bookmark = {
        ...bookmark,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      dispatch(addBookmark(newBookmark))

      try {
        await addBookmarkMutation(bookmark).unwrap()
      } catch (error) {
        console.error("Failed to sync bookmark:", error)
      }
    },
    [dispatch, addBookmarkMutation],
  )

  const toggleNovelFavorite = useCallback(
    (novelId: string) => {
      dispatch(toggleFavorite(novelId))
    },
    [dispatch],
  )

  return {
    ...readingState,
    setNovel,
    setChapter,
    updateProgress,
    createBookmark,
    toggleNovelFavorite,
  }
}
