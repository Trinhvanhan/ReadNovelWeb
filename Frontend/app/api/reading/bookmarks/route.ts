import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, addBookmark, removeBookmark, getUserBookmarks } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const bookmarks = await getUserBookmarks(user.id)
    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error("Bookmarks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { novelId, chapterNumber, note } = await request.json()

    // Check if bookmark exists
    const bookmarks = await getUserBookmarks(user.id)
    const existingBookmark = bookmarks.find((b) => b.novelId === novelId && b.chapterNumber === chapterNumber)

    let result
    if (existingBookmark) {
      await removeBookmark(user.id, novelId, chapterNumber)
      result = { novelId, chapterNumber, isBookmarked: false }
    } else {
      await addBookmark(user.id, novelId, chapterNumber, note)
      result = { novelId, chapterNumber, isBookmarked: true }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Bookmark toggle error:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
