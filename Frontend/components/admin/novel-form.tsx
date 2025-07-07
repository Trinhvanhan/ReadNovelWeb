"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X } from "lucide-react"
import { createNovelAction, updateNovelAction } from "@/app/actions/admin"
import type { Novel } from "@/lib/admin"

interface NovelFormProps {
  novel?: Novel
}

const genreOptions = [
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Thriller",
  "Adventure",
  "Drama",
  "Comedy",
  "Horror",
  "Historical",
  "Contemporary",
  "Dystopian",
  "Urban Fantasy",
  "Paranormal",
  "Young Adult",
]

export function NovelForm({ novel }: NovelFormProps) {
  const [genres, setGenres] = useState<string[]>(novel?.genre || [])
  const [tags, setTags] = useState<string[]>(novel?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const addGenre = (genre: string) => {
    if (!genres.includes(genre)) {
      setGenres([...genres, genre])
    }
  }

  const removeGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    // Add genres and tags to form data
    formData.set("genre", JSON.stringify(genres))
    formData.set("tags", JSON.stringify(tags))

    const result = novel ? await updateNovelAction(novel.id, formData) : await createNovelAction(formData)

    if (result.success) {
      if (novel) {
        router.push(`/admin/novels/${novel.id}`)
      } else {
        router.push(`/admin/novels/${result.novelId}`)
      }
      router.refresh()
    } else {
      setErrors(result.errors || {})
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{novel ? "Edit Novel" : "Create New Novel"}</CardTitle>
        <CardDescription>
          {novel ? "Update the novel details below" : "Fill in the details to create a new novel"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general[0]}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={novel?.title}
                placeholder="Enter novel title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                defaultValue={novel?.author}
                placeholder="Enter author name"
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && <p className="text-sm text-red-500">{errors.author[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={novel?.description}
              placeholder="Enter novel description"
              rows={6}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={novel?.status || "ongoing"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="hiatus">Hiatus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select name="language" defaultValue={novel?.language || "English"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Korean">Korean</SelectItem>
                </SelectContent>
              </Select>
              {errors.language && <p className="text-sm text-red-500">{errors.language[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Genres *</Label>
            <Select onValueChange={addGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Add genres" />
              </SelectTrigger>
              <SelectContent>
                {genreOptions
                  .filter((genre) => !genres.includes(genre))
                  .map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => removeGenre(genre)}>
                  {genre}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            {errors.genre && <p className="text-sm text-red-500">{errors.genre[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPublished" name="isPublished" defaultChecked={novel?.isPublished} />
            <Label htmlFor="isPublished">Publish immediately</Label>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : novel ? "Update Novel" : "Create Novel"}
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
