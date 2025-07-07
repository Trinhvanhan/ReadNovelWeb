import { type NextRequest, NextResponse } from "next/server"
import { getNovelById } from "@/lib/novels"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const novel = await getNovelById(params.id)

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 })
    }

    return NextResponse.json(novel)
  } catch (error) {
    console.error("Novel fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch novel" }, { status: 500 })
  }
}
