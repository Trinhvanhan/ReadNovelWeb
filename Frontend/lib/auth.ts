import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface ReadingProgress {
  userId: string
  novelId: string
  currentChapter: number
  progress: number
  lastRead: string
  status: "reading" | "completed" | "dropped"
  bookmarkedChapters: number[]
}

// Mock database - in a real app, this would be a proper database
const users: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    createdAt: new Date().toISOString(),
  },
]

const readingProgress: ReadingProgress[] = [
  {
    userId: "1",
    novelId: "1",
    currentChapter: 34,
    progress: 75,
    lastRead: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: "reading",
    bookmarkedChapters: [5, 12, 28],
  },
  {
    userId: "1",
    novelId: "2",
    currentChapter: 32,
    progress: 100,
    lastRead: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    status: "completed",
    bookmarkedChapters: [15, 25],
  },
]

export async function createUser(email: string, password: string, name: string): Promise<User> {
  // In a real app, you'd hash the password and store it securely
  const user: User = {
    id: (users.length + 1).toString(),
    email,
    name,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  return user
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  // In a real app, you'd verify the hashed password
  const user = users.find((u) => u.email === email)
  return user || null
}

export async function createSession(userId: string) {
  const session = {
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  }

  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) return null

  try {
    const session = JSON.parse(sessionCookie.value)
    if (new Date(session.expiresAt) < new Date()) {
      return null
    }
    return { userId: session.userId }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  const user = users.find((u) => u.id === session.userId)
  return user || null
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function getUserReadingProgress(userId: string): Promise<ReadingProgress[]> {
  return readingProgress.filter((rp) => rp.userId === userId)
}

export async function updateReadingProgress(
  userId: string,
  novelId: string,
  chapter: number,
  progress: number,
): Promise<void> {
  const existingIndex = readingProgress.findIndex((rp) => rp.userId === userId && rp.novelId === novelId)

  const progressData: ReadingProgress = {
    userId,
    novelId,
    currentChapter: chapter,
    progress,
    lastRead: new Date().toISOString(),
    status: progress >= 100 ? "completed" : "reading",
    bookmarkedChapters: existingIndex >= 0 ? readingProgress[existingIndex].bookmarkedChapters : [],
  }

  if (existingIndex >= 0) {
    readingProgress[existingIndex] = progressData
  } else {
    readingProgress.push(progressData)
  }
}

export async function addBookmark(userId: string, novelId: string, chapter: number): Promise<void> {
  const progressIndex = readingProgress.findIndex((rp) => rp.userId === userId && rp.novelId === novelId)

  if (progressIndex >= 0) {
    const bookmarks = readingProgress[progressIndex].bookmarkedChapters
    if (!bookmarks.includes(chapter)) {
      bookmarks.push(chapter)
    }
  }
}

export async function removeBookmark(userId: string, novelId: string, chapter: number): Promise<void> {
  const progressIndex = readingProgress.findIndex((rp) => rp.userId === userId && rp.novelId === novelId)

  if (progressIndex >= 0) {
    const bookmarks = readingProgress[progressIndex].bookmarkedChapters
    const bookmarkIndex = bookmarks.indexOf(chapter)
    if (bookmarkIndex >= 0) {
      bookmarks.splice(bookmarkIndex, 1)
    }
  }
}
