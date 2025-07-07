import { type NextRequest, NextResponse } from "next/server"
import { refreshSession, getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const sessionData = await refreshSession(user.id)

    return NextResponse.json({
      expiresAt: sessionData.expiresAt,
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ error: "Token refresh failed" }, { status: 401 })
  }
}
