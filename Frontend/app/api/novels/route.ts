import { type NextRequest, NextResponse } from "next/server"
import { getNovels } from "@/lib/novels"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const filters = Object.fromEntries(
      Array.from(searchParams.entries()).filter(([key]) => !["page", "limit"].includes(key)),
    )

    const result = await getNovels({ page, limit, filters })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Novels fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch novels" }, { status: 500 })
  }
}
