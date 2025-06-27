import { getCurrentUser } from "./auth"
import { redirect } from "next/navigation"

export interface Novel {
  id: string
  title: string
  author: string
  cover?: string
  rating: number
  totalRatings: number
  chapters: number
  status: "ongoing" | "completed" | "hiatus"
  genre: string[]
  tags: string[]
  description: string
  publishedDate: string
  lastUpdated: string
  wordCount: string
  readingTime: string
  language: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  id: string
  novelId: string
  number: number
  title: string
  content: string
  publishDate: string
  wordCount: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "editor" | "user"
  avatar?: string
  createdAt: string
}

// Mock data - in a real app, this would be a proper database
const novels: Novel[] = [
  {
    id: "1",
    title: "The Midnight Chronicles",
    author: "Sarah Chen",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    totalRatings: 2847,
    chapters: 45,
    status: "ongoing",
    genre: ["Fantasy", "Adventure"],
    tags: ["Strong Female Lead", "Magic System", "Epic Fantasy"],
    description: "A thrilling tale of magic and adventure in a world where darkness threatens to consume everything.",
    publishedDate: "2023-06-15",
    lastUpdated: "2024-01-15",
    wordCount: "450,000",
    readingTime: "18 hours",
    language: "English",
    isPublished: true,
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Digital Hearts",
    author: "Alex Rivera",
    cover: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    totalRatings: 1523,
    chapters: 32,
    status: "completed",
    genre: ["Sci-Fi", "Romance"],
    tags: ["Virtual Reality", "AI", "Love Story"],
    description: "Love blooms in the digital age as two programmers navigate virtual reality and real emotions.",
    publishedDate: "2023-08-20",
    lastUpdated: "2023-12-10",
    wordCount: "320,000",
    readingTime: "13 hours",
    language: "English",
    isPublished: true,
    createdAt: "2023-08-20T00:00:00Z",
    updatedAt: "2023-12-10T00:00:00Z",
  },
]

const chapters: Chapter[] = [
  {
    id: "1",
    novelId: "1",
    number: 1,
    title: "The Awakening",
    content: "The morning mist clung to the ancient stones...",
    publishDate: "2023-06-15",
    wordCount: 3200,
    isPublished: true,
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z",
  },
  {
    id: "2",
    novelId: "1",
    number: 2,
    title: "Shadows of the Past",
    content: "Aria woke to the sound of thunder...",
    publishDate: "2023-06-17",
    wordCount: 3800,
    isPublished: true,
    createdAt: "2023-06-17T00:00:00Z",
    updatedAt: "2023-06-17T00:00:00Z",
  },
]

// Admin users with elevated permissions
const adminUsers: AdminUser[] = [
  {
    id: "admin1",
    email: "admin@novelreader.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "editor1",
    email: "editor@novelreader.com",
    name: "Editor User",
    role: "editor",
    createdAt: "2023-01-01T00:00:00Z",
  },
]

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const adminUser = adminUsers.find((admin) => admin.email === user.email)
  if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "editor")) {
    redirect("/")
  }

  return adminUser
}

export async function getAllNovels(): Promise<Novel[]> {
  return novels
}

export async function getNovelById(id: string): Promise<Novel | null> {
  return novels.find((novel) => novel.id === id) || null
}

export async function createNovel(novelData: Omit<Novel, "id" | "createdAt" | "updatedAt">): Promise<Novel> {
  const novel: Novel = {
    ...novelData,
    id: (novels.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  novels.push(novel)
  return novel
}

export async function updateNovel(id: string, novelData: Partial<Novel>): Promise<Novel | null> {
  const index = novels.findIndex((novel) => novel.id === id)
  if (index === -1) return null

  novels[index] = {
    ...novels[index],
    ...novelData,
    updatedAt: new Date().toISOString(),
  }
  return novels[index]
}

export async function deleteNovel(id: string): Promise<boolean> {
  const index = novels.findIndex((novel) => novel.id === id)
  if (index === -1) return false

  novels.splice(index, 1)
  // Also delete associated chapters
  const chapterIndices = chapters
    .map((chapter, idx) => (chapter.novelId === id ? idx : -1))
    .filter((idx) => idx !== -1)
    .reverse()

  chapterIndices.forEach((idx) => chapters.splice(idx, 1))
  return true
}

export async function getChaptersByNovelId(novelId: string): Promise<Chapter[]> {
  return chapters.filter((chapter) => chapter.novelId === novelId).sort((a, b) => a.number - b.number)
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  return chapters.find((chapter) => chapter.id === id) || null
}

export async function createChapter(chapterData: Omit<Chapter, "id" | "createdAt" | "updatedAt">): Promise<Chapter> {
  const chapter: Chapter = {
    ...chapterData,
    id: (chapters.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  chapters.push(chapter)

  // Update novel's chapter count and last updated
  const novelIndex = novels.findIndex((novel) => novel.id === chapterData.novelId)
  if (novelIndex !== -1) {
    novels[novelIndex].chapters = chapters.filter((c) => c.novelId === chapterData.novelId).length
    novels[novelIndex].lastUpdated = new Date().toISOString()
    novels[novelIndex].updatedAt = new Date().toISOString()
  }

  return chapter
}

export async function updateChapter(id: string, chapterData: Partial<Chapter>): Promise<Chapter | null> {
  const index = chapters.findIndex((chapter) => chapter.id === id)
  if (index === -1) return null

  chapters[index] = {
    ...chapters[index],
    ...chapterData,
    updatedAt: new Date().toISOString(),
  }

  // Update novel's last updated
  const novelIndex = novels.findIndex((novel) => novel.id === chapters[index].novelId)
  if (novelIndex !== -1) {
    novels[novelIndex].lastUpdated = new Date().toISOString()
    novels[novelIndex].updatedAt = new Date().toISOString()
  }

  return chapters[index]
}

export async function deleteChapter(id: string): Promise<boolean> {
  const index = chapters.findIndex((chapter) => chapter.id === id)
  if (index === -1) return false

  const chapter = chapters[index]
  chapters.splice(index, 1)

  // Update novel's chapter count
  const novelIndex = novels.findIndex((novel) => novel.id === chapter.novelId)
  if (novelIndex !== -1) {
    novels[novelIndex].chapters = chapters.filter((c) => c.novelId === chapter.novelId).length
    novels[novelIndex].updatedAt = new Date().toISOString()
  }

  return true
}

export async function getAdminStats() {
  const totalNovels = novels.length
  const publishedNovels = novels.filter((n) => n.isPublished).length
  const totalChapters = chapters.length
  const publishedChapters = chapters.filter((c) => c.isPublished).length

  return {
    totalNovels,
    publishedNovels,
    draftNovels: totalNovels - publishedNovels,
    totalChapters,
    publishedChapters,
    draftChapters: totalChapters - publishedChapters,
    totalWords: novels.reduce((sum, novel) => sum + Number.parseInt(novel.wordCount.replace(/,/g, "")), 0),
    averageRating: novels.reduce((sum, novel) => sum + novel.rating, 0) / novels.length,
  }
}
