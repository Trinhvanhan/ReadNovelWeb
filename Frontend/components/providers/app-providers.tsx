"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ReduxProvider } from "./redux-provider"
import { NotificationProvider } from "./notification-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

interface AppProvidersProps {
  children: React.ReactNode
  initialUser?: any
}

export function AppProviders({ children, initialUser }: AppProvidersProps) {
  return (
    <div className={inter.className}>
      <ReduxProvider>
        <AuthProvider initialUser={initialUser}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </ReduxProvider>
    </div>
  )
}
