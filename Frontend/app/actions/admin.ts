"use server"

import {
  createNovel,
  updateNovel,
  deleteNovel,
  createChapter,
  updateChapter,
  deleteChapter,
  requireAdmin,
  type Novel,
  type Chapter,
} from "@/lib/admin"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  sendNewChapterNotification,
  sendNovelCompletedNotification,
  sendAdminNewNovelNotification,
} from "@/lib/notifications"

const novelSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  tags: z.array(z.string()),
  status: z.enum(["ongoing", "completed", "hiatus"]),
  language: z.string().min(1, "Language is required"),
  isPublished: z.boolean(),
})

const chapterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  isPublished: z.boolean(),
})

export async function createNovelAction(formData: FormData) {
  await requireAdmin()

  const rawData = {
    title: formData.get("title") as string,
    author: formData.get("author") as string,
    description: formData.get("description") as string,
    genre: JSON.parse(formData.get("genre") as string),
    tags: JSON.parse(formData.get("tags") as string),
    status: formData.get("status") as "ongoing" | "completed" | "hiatus",
    language: formData.get("language") as string,
    isPublished: formData.get("isPublished") === "true",
  }

  const result = novelSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const novelData: Omit<Novel, "id" | "createdAt" | "updatedAt"> = {
      ...result.data,
      cover: "/placeholder.svg?height=400&width=300",
      rating: 0,
      totalRatings: 0,
      chapters: 0,
      publishedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      wordCount: "0",
      readingTime: "0 hours",
    }

    const novel = await createNovel(novelData)
    // Send admin notification for new novel
    if (result.data.isPublished) {
      await sendAdminNewNovelNotification(result.data.title, result.data.author)
    }
    revalidatePath("/admin/novels")
    return { success: true, novelId: novel.id }
  } catch (error) {
    return {
      success: false,
      errors: { general: ["Failed to create novel"] },
    }
  }
}

export async function updateNovelAction(id: string, formData: FormData) {
  await requireAdmin()

  const rawData = {
    title: formData.get("title") as string,
    author: formData.get("author") as string,
    description: formData.get("description") as string,
    genre: JSON.parse(formData.get("genre") as string),
    tags: JSON.parse(formData.get("tags") as string),
    status: formData.get("status") as "ongoing" | "completed" | "hiatus",
    language: formData.get("language") as string,
    isPublished: formData.get("isPublished") === "true",
  }

  const result = novelSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    await updateNovel(id, result.data)
    // Send completion notification if status changed to completed
    if (result.data.status === "completed") {
      await sendNovelCompletedNotification(id, result.data.title)
    }
    revalidatePath("/admin/novels")
    revalidatePath(`/admin/novels/${id}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      errors: { general: ["Failed to update novel"] },
    }
  }
}

export async function deleteNovelAction(id: string) {
  await requireAdmin()

  try {
    const success = await deleteNovel(id)
    if (success) {
      revalidatePath("/admin/novels")
      return { success: true }
    }
    return { success: false, error: "Novel not found" }
  } catch (error) {
    return { success: false, error: "Failed to delete novel" }
  }
}

export async function createChapterAction(novelId: string, formData: FormData) {
  await requireAdmin()

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    isPublished: formData.get("isPublished") === "true",
  }

  const result = chapterSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    // Get the next chapter number
    const existingChapters = await import("@/lib/admin").then((mod) => mod.getChaptersByNovelId(novelId))
    const nextChapterNumber = existingChapters.length + 1

    const chapterData: Omit<Chapter, "id" | "createdAt" | "updatedAt"> = {
      novelId,
      number: nextChapterNumber,
      title: result.data.title,
      content: result.data.content,
      publishDate: new Date().toISOString().split("T")[0],
      wordCount: result.data.content.split(/\s+/).length,
      isPublished: result.data.isPublished,
    }

    const chapter = await createChapter(chapterData)
    // Send new chapter notification if published
    if (result.data.isPublished) {
      // Get novel title (in real app, from database)
      const novelTitle = "The Midnight Chronicles" // Mock - replace with actual novel lookup
      await sendNewChapterNotification(novelId, novelTitle, result.data.title, nextChapterNumber)
    }
    revalidatePath(`/admin/novels/${novelId}`)
    revalidatePath("/admin/novels")
    return { success: true, chapterId: chapter.id }
  } catch (error) {
    return {
      success: false,
      errors: { general: ["Failed to create chapter"] },
    }
  }
}

export async function updateChapterAction(id: string, formData: FormData) {
  await requireAdmin()

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    isPublished: formData.get("isPublished") === "true",
  }

  const result = chapterSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const updateData = {
      ...result.data,
      wordCount: result.data.content.split(/\s+/).length,
    }

    await updateChapter(id, updateData)
    revalidatePath("/admin/novels")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      errors: { general: ["Failed to update chapter"] },
    }
  }
}

export async function deleteChapterAction(id: string) {
  await requireAdmin()

  try {
    const success = await deleteChapter(id)
    if (success) {
      revalidatePath("/admin/novels")
      return { success: true }
    }
    return { success: false, error: "Chapter not found" }
  } catch (error) {
    return { success: false, error: "Failed to delete chapter" }
  }
}
