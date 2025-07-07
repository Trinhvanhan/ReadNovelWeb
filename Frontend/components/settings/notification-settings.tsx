"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { updateUserNotificationPreferences } from "@/app/actions/notifications"
import type { NotificationPreferences } from "@/lib/notifications"

interface NotificationSettingsProps {
  preferences: NotificationPreferences
}

export function NotificationSettings({ preferences }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setShowSuccess(false)

    const result = await updateUserNotificationPreferences(formData)

    if (result.success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }

    setIsLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Notification preferences updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications" className="text-base font-medium">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch id="emailNotifications" name="emailNotifications" defaultChecked={preferences.emailNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="newChapters" className="text-base font-medium">
              New Chapters
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified when new chapters are published for novels in your library
            </p>
          </div>
          <Switch id="newChapters" name="newChapters" defaultChecked={preferences.newChapters} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="novelCompleted" className="text-base font-medium">
              Novel Completed
            </Label>
            <p className="text-sm text-muted-foreground">Get notified when novels in your library are completed</p>
          </div>
          <Switch id="novelCompleted" name="novelCompleted" defaultChecked={preferences.novelCompleted} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="readingMilestones" className="text-base font-medium">
              Reading Milestones
            </Label>
            <p className="text-sm text-muted-foreground">Celebrate your reading achievements and progress milestones</p>
          </div>
          <Switch id="readingMilestones" name="readingMilestones" defaultChecked={preferences.readingMilestones} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="systemUpdates" className="text-base font-medium">
              System Updates
            </Label>
            <p className="text-sm text-muted-foreground">
              Important updates about NovelReader features and maintenance
            </p>
          </div>
          <Switch id="systemUpdates" name="systemUpdates" defaultChecked={preferences.systemUpdates} />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  )
}
