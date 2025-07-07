import { requireAdmin, getAllNovels } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Plus, Search, Filter, Edit, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DeleteNovelButton } from "@/components/admin/delete-novel-button"

export default async function AdminNovelsPage() {
  await requireAdmin()
  const novels = await getAllNovels()

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

            <Link href="/admin/novels/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Novel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Novels</h1>
          <p className="text-muted-foreground">Create, edit, and manage your novel collection</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search novels..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Novels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.map((novel) => (
            <Card key={novel.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={novel.cover || "/placeholder.svg"}
                  alt={novel.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant={novel.isPublished ? "default" : "secondary"}>
                    {novel.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{novel.title}</CardTitle>
                <CardDescription>by {novel.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Chapters:</span>
                    <span>{novel.chapters}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline">{novel.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <span>
                      {novel.rating} ({novel.totalRatings} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{new Date(novel.lastUpdated).toLocaleDateString()}</span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Link href={`/admin/novels/${novel.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/novel/${novel.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteNovelButton novelId={novel.id} novelTitle={novel.title} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {novels.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No novels yet</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first novel</p>
              <Link href="/admin/novels/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Novel
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
