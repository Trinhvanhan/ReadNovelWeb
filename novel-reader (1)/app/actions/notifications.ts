"use server"

import {
  updateNotificationPreferences,
  sendNewChapterNotification,
  sendNovelCompletedNotification,
  checkReadingMilestones,
} from "@/lib/notifications"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateUserNotificationPreferences(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const preferences = {
      emailNotifications: formData.get("emailNotifications") === "true",
      newChapters: formData.get("newChapters") === "true",
      novelCompleted: formData.get("novelCompleted") === "true",
      readingMilestones: formData.get("readingMilestones") === "true",
      systemUpdates: formData.get("systemUpdates") === "true",
    }

    await updateNotificationPreferences(user.id, preferences)
    revalidatePath("/settings")

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update preferences" }
  }
}

export async function triggerNewChapterNotification(
  novelId: string,
  novelTitle: string,
  chapterTitle: string,
  chapterNumber: number,
) {
  try {
    await sendNewChapterNotification(novelId, novelTitle, chapterTitle, chapterNumber)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to send notifications" }
  }
}

export async function triggerNovelCompletedNotification(novelId: string, novelTitle: string) {
  try {
    await sendNovelCompletedNotification(novelId, novelTitle)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to send notifications" }
  }
}

export async function triggerReadingMilestoneCheck(novelId: string, progress: number) {
  const user = await getCurrentUser()
  if (!user) return { success: false, error: "Not authenticated" }

  try {
    await checkReadingMilestones(user.id, novelId, progress)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to check milestones" }
  }
}
