import { getCurrentUser, getUserReadingProgress } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { novelId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const progress = await getUserReadingProgress(user.id)
    const novelProgress = progress.find((p) => p.novelId === params.novelId)

    return NextResponse.json(
      novelProgress || {
        userId: user.id,
        novelId: params.novelId,
        currentChapter: 1,
        progress: 0,
        lastRead: new Date().toISOString(),
        status: "reading",
        bookmarkedChapters: [],
      },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
