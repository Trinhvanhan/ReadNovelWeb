import { type NextRequest, NextResponse } from "next/server"
import { searchNovels } from "@/lib/search"
import { z } from "zod"

const searchSchema = z.object({
  q: z.string().optional().default(""),
  genres: z.string().optional(),
  status: z.string().optional(),
  rating: z.string().optional(),
  wordCount: z.string().optional(),
  language: z.string().optional(),
  tags: z.string().optional(),
  sortBy: z.enum(["relevance", "rating", "popularity", "newest", "updated"]).optional().default("relevance"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())

    const {
      q: query,
      genres,
      status,
      rating,
      wordCount,
      language,
      tags,
      sortBy,
      sortOrder,
      page,
      limit,
    } = searchSchema.parse(params)

    const filters = {
      genres: genres ? genres.split(",") : [],
      status: status ? status.split(",") : [],
      rating: rating ? rating.split(",").map(Number) : [0, 5],
      wordCount: wordCount ? wordCount.split(",") : [],
      language: language ? language.split(",") : [],
      tags: tags ? tags.split(",") : [],
    }

    const results = await searchNovels({
      query,
      filters,
      sortBy,
      sortOrder,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
