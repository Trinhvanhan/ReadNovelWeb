import { requireAdmin, getNovelById, getChaptersByNovelId } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Eye } from "lucide-react"
import Link from "next/link"
import { NovelForm } from "@/components/admin/novel-form"
import { ChapterList } from "@/components/admin/chapter-list"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function EditNovelPage({ params }: Props) {
  await requireAdmin()
  const novel = await getNovelById(params.id)
  const chapters = await getChaptersByNovelId(params.id)

  if (!novel) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">NovelReader</span>
              </Link>
              <Badge variant="secondary">Admin Panel</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Link href={`/novel/${novel.id}`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <Link href={`/admin/novels/${novel.id}/chapters/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chapter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Edit Novel: {novel.title}</h1>
            <p className="text-muted-foreground">Manage novel details and chapters</p>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Novel Details</TabsTrigger>
              <TabsTrigger value="chapters">Chapters ({chapters.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <NovelForm novel={novel} />
            </TabsContent>

            <TabsContent value="chapters" className="mt-6">
              <ChapterList novelId={novel.id} chapters={chapters} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
