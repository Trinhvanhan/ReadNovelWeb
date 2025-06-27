"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createChapterAction, updateChapterAction } from "@/app/actions/admin"
import type { Chapter } from "@/lib/admin"

interface ChapterFormProps {
  novelId: string
  chapter?: Chapter
}

export function ChapterForm({ novelId, chapter }: ChapterFormProps) {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    const result = chapter
      ? await updateChapterAction(chapter.id, formData)
      : await createChapterAction(novelId, formData)

    if (result.success) {
      router.push(`/admin/novels/${novelId}`)
      router.refresh()
    } else {
      setErrors(result.errors || {})
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chapter ? "Edit Chapter" : "Create New Chapter"}</CardTitle>
        <CardDescription>
          {chapter ? "Update the chapter details below" : "Fill in the details to create a new chapter"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general[0]}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Chapter Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={chapter?.title}
              placeholder="Enter chapter title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Chapter Content *</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={chapter?.content}
              placeholder="Write your chapter content here..."
              rows={20}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content[0]}</p>}
            <p className="text-xs text-muted-foreground">Tip: Use double line breaks to separate paragraphs</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPublished" name="isPublished" defaultChecked={chapter?.isPublished} />
            <Label htmlFor="isPublished">Publish immediately</Label>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : chapter ? "Update Chapter" : "Create Chapter"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
