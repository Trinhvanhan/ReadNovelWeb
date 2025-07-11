"use server"
import { deleteCookies } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"
import { sendWelcomeEmail, sendAdminNewUserNotification } from "@/lib/notifications"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// export async function signup(formData: FormData) {
//   const rawData = {
//     name: formData.get("name") as string,
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//     confirmPassword: formData.get("confirmPassword") as string,
//   }

//   const result = signupSchema.safeParse(rawData)

//   if (!result.success) {
//     return {
//       success: false,
//       errors: result.error.flatten().fieldErrors,
//     }
//   }

//   const { name, email, password } = result.data

//   try {
//     // Check if user already exists
//     const existingUser = await validateUser(email, "dummy")
//     if (existingUser) {
//       return {
//         success: false,
//         errors: { email: ["User with this email already exists"] },
//       }
//     }

//     const user = await createUser(email, password, name)
//     await createSession(user.id)

//     // Send welcome email and admin notification
//     await sendWelcomeEmail(user)
//     await sendAdminNewUserNotification(user)

//     return { success: true }
//   } catch (error) {
//     return {
//       success: false,
//       errors: { general: ["An error occurred during signup"] },
//     }
//   }
// }

// export async function login(formData: FormData) {
//   const rawData = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   }

//   const result = loginSchema.safeParse(rawData)

//   if (!result.success) {
//     return {
//       success: false,
//       errors: result.error.flatten().fieldErrors,
//     }
//   }

//   const { email, password } = result.data

//   try {
//     const user = await validateUser(email, password)

//     if (!user) {
//       return {
//         success: false,
//         errors: { general: ["Invalid email or password"] },
//       }
//     }

//     await createSession(user.id)
//     return { success: true }
//   } catch (error) {
//     return {
//       success: false,
//       errors: { general: ["An error occurred during login"] },
//     }
//   }
// }

export async function logout() {
  await deleteCookies()
  redirect("/")
}
