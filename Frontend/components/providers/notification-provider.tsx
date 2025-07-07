"use client"

import type React from "react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addNotification } from "@/lib/store/slices/notificationSlice"
import { addToast } from "@/lib/store/slices/uiSlice"

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) return

    // WebSocket connection for real-time notifications
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data)
        dispatch(addNotification(notification))

        // Show toast for important notifications
        if (notification.type === "error" || notification.type === "warning") {
          dispatch(
            addToast({
              id: Date.now().toString(),
              type: notification.type,
              title: notification.title,
              description: notification.message,
              duration: 5000,
            }),
          )
        }
      } catch (error) {
        console.error("Failed to parse notification:", error)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
    }

    return () => {
      ws.close()
    }
  }, [isAuthenticated, dispatch])

  return <>{children}</>
}
