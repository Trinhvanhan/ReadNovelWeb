import { requireAdmin, getNovelById } from "@/lib/admin"
import { ChapterForm } from "@/components/admin/chapter-form"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function NewChapterPage({ params }: Props) {
  await requireAdmin()
  const novel = await getNovelById(params.id)

  if (!novel) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">NovelReader</span>
            </Link>
            <Badge variant="secondary">Admin Panel</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Chapter</h1>
            <p className="text-muted-foreground">Create a new chapter for "{novel.title}"</p>
          </div>

          <ChapterForm novelId={params.id} />
        </div>
      </div>
    </div>
  )
}
