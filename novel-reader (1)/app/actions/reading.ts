"use server"

import { updateReadingProgress, addBookmark, removeBookmark, getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { checkReadingMilestones } from "@/lib/notifications"

export async function updateProgress(novelId: string, chapter: number, progress: number) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  await updateReadingProgress(user.id, novelId, chapter, progress)

  // Check for reading milestones
  await checkReadingMilestones(user.id, novelId, progress)

  revalidatePath("/library")
  revalidatePath(`/read/${novelId}/${chapter}`)
}

export async function toggleBookmark(novelId: string, chapter: number, isBookmarked: boolean) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  if (isBookmarked) {
    await removeBookmark(user.id, novelId, chapter)
  } else {
    await addBookmark(user.id, novelId, chapter)
  }

  revalidatePath(`/read/${novelId}/${chapter}`)
}
