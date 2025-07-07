import { type NextRequest, NextResponse } from "next/server"
import { getChapter } from "@/lib/novels"

export async function GET(request: NextRequest, { params }: { params: { id: string; chapter: string } }) {
  try {
    const chapterNumber = Number.parseInt(params.chapter)
    const chapter = await getChapter(params.id, chapterNumber)

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error("Chapter fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch chapter" }, { status: 500 })
  }
}
