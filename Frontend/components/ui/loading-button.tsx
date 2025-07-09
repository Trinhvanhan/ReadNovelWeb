"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoadingButtonProps extends Omit<ButtonProps, "onClick"> {
  loading?: boolean
  loadingText?: string
  onClick?: () => Promise<void> | void
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, loadingText = "Loading...", onClick, disabled, ...props }, ref) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClick = async () => {
      if (!onClick) return

      setIsLoading(true)
      try {
        await onClick()
      } finally {
        setIsLoading(false)
      }
    }

    const showLoading = loading || isLoading
    const isDisabled = disabled || showLoading

    return (
      <Button {...props} ref={ref} disabled={isDisabled} onClick={handleClick}>
        {showLoading && <Loader2 className="animate-spin" />}
        {showLoading ? loadingText : children}
      </Button>
    )
  },
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
