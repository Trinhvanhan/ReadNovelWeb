import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AppProviders } from "@/components/providers/app-providers"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en">
      <body>
        <AppProviders initialUser={user}>{children}</AppProviders>
      </body>
    </html>
  )
}
