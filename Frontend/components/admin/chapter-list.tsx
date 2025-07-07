import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Plus } from "lucide-react"
import Link from "next/link"
import type { Chapter } from "@/lib/admin"
import { DeleteChapterButton } from "./delete-chapter-button"

interface ChapterListProps {
  novelId: string
  chapters: Chapter[]
}

export function ChapterList({ novelId, chapters }: ChapterListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Chapters</h2>
          <p className="text-muted-foreground">Manage novel chapters</p>
        </div>
        <Link href={`/admin/novels/${novelId}/chapters/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
        </Link>
      </div>

      {chapters.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating the first chapter</p>
            <Link href={`/admin/novels/${novelId}/chapters/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Chapter
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">
                        Chapter {chapter.number}: {chapter.title}
                      </h3>
                      <Badge variant={chapter.isPublished ? "default" : "secondary"}>
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{chapter.wordCount.toLocaleString()} words</span>
                      <span>Published: {new Date(chapter.publishDate).toLocaleDateString()}</span>
                      <span>Updated: {new Date(chapter.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/novels/${novelId}/chapters/${chapter.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/read/${novelId}/${chapter.number}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteChapterButton chapterId={chapter.id} chapterTitle={chapter.title} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
