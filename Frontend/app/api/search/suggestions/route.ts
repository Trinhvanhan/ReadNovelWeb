import { type NextRequest, NextResponse } from "next/server"
import { getSearchSuggestions } from "@/lib/search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query.trim()) {
      return NextResponse.json([])
    }

    const suggestions = await getSearchSuggestions(query)
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Suggestions error:", error)
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
