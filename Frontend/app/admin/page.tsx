import { requireAdmin, getAdminStats, getAllNovels } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, TrendingUp, FileText, Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function AdminDashboard() {
  const admin = await requireAdmin()
  const stats = await getAdminStats()
  const recentNovels = (await getAllNovels()).slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">NovelReader</span>
              </Link>
              <Badge variant="secondary">Admin Panel</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {admin.name}</span>
              <Link href="/admin/novels/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Novel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your novel collection and monitor platform statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Novels</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNovels}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedNovels} published, {stats.draftNovels} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChapters}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedChapters} published, {stats.draftChapters} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Words</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all novels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Platform average</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Novel Management</CardTitle>
              <CardDescription>Create and manage your novel collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/novels/new">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Novel
                </Button>
              </Link>
              <Link href="/admin/novels">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Novels
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Review</CardTitle>
              <CardDescription>Review and publish pending content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Review Drafts ({stats.draftNovels + stats.draftChapters})
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Bulk Publish
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed platform analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                User Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Novels */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Novels</CardTitle>
                <CardDescription>Latest novels in your collection</CardDescription>
              </div>
              <Link href="/admin/novels">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNovels.map((novel) => (
                <div key={novel.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Image
                    src={novel.cover || "/placeholder.svg"}
                    alt={novel.title}
                    width={60}
                    height={80}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{novel.title}</h3>
                    <p className="text-sm text-muted-foreground">by {novel.author}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={novel.isPublished ? "default" : "secondary"}>
                        {novel.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{novel.status}</Badge>
                      <span className="text-xs text-muted-foreground">{novel.chapters} chapters</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/novels/${novel.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/novel/${novel.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
