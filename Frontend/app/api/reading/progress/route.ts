import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, updateReadingProgress, getUserReadingProgress } from "@/lib/auth"
import { checkReadingMilestones } from "@/lib/notifications"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const progress = await getUserReadingProgress(user.id)
    return NextResponse.json(progress)
  } catch (error) {
    console.error("Progress fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { novelId, chapterNumber, progress } = await request.json()

    const updatedProgress = await updateReadingProgress(user.id, novelId, chapterNumber, progress)

    // Check for reading milestones
    await checkReadingMilestones(user.id, novelId, progress)

    return NextResponse.json(updatedProgress)
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
