"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { removeToast } from "@/lib/store/slices/uiSlice"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastAction,
} from "@/components/ui/toast"

export function Toaster() {
  const toasts = useAppSelector((state) => state.ui.toasts)
  const dispatch = useAppDispatch()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, message, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          onOpenChange={(open) => {
            if (!open) {
              dispatch(removeToast(id))
            }
          }}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {message && <ToastDescription>{message}</ToastDescription>}
          </div>
          {action && (
            <ToastAction altText={action.label} onClick={action.onClick}>
              {action.label}
            </ToastAction>
          )}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
