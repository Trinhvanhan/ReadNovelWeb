"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleInteraction } from "@/lib/apis/interaction.api"

interface InteractiveButtonProps {
  novelId: string
  typeInteraction: "follow" | "favorite" | "feature"
  isActived: boolean
  children: React.ReactNode
}

export function InteractiveButton({
  novelId,
  typeInteraction,
  children,
  isActived
}: InteractiveButtonProps) {
  const [isActive, setIsActive] = useState(isActived)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)

    try {
      const result = await toggleInteraction({
        targetId: novelId,
        targetType: 'Novel',
        type: typeInteraction
      })  

      if(result.status === 200) {
        setIsActive(!isActive)
      }
    } catch (error) {
      console.error("Interaction failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ scale: 0.5, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.5, opacity: 0 }}
  transition={{
    duration: 0.3,
    ease: "easeOut",
  }}>
      <Button
        size="lg"
        variant={isActive ? "default" : "outline"}
        onClick={handleToggle}
        disabled={loading}
        className="flex items-center space-x-2 transition-all duration-200"
      >
        {children}
      </Button>
    </motion.div>
  )
}