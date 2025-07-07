import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"
import { sendWelcomeEmail, sendAdminNewUserNotification } from "@/lib/notifications"
import { z } from "zod"
import { validateUser } from "@/lib/utils"

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await validateUser(email, "dummy")
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const user = await createUser(email, password, name)
    const sessionData = await createSession(user.id)

    // Send welcome email and admin notification
    await sendWelcomeEmail(user)
    await sendAdminNewUserNotification(user)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        preferences: user.preferences,
      },
      token: sessionData.token,
      expiresAt: sessionData.expiresAt,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
