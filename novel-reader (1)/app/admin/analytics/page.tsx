import { requireAdmin } from "@/lib/admin"
import { getSearchAnalytics } from "@/lib/search"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"

export default async function AdminAnalyticsPage() {
  await requireAdmin()
  const analytics = await getSearchAnalytics()

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Analytics</h1>
          <p className="text-muted-foreground">Monitor search behavior and popular content</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalSearches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Results</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageResultsPerSearch.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Queries</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.topQueries.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Popular Genres</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.topGenres.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Search Queries */}
          <Card>
            <CardHeader>
              <CardTitle>Top Search Queries</CardTitle>
              <CardDescription>Most popular search terms</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topQueries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No search data available</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topQueries.map((query, index) => (
                    <div key={query.query} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{query.query}</span>
                      </div>
                      <Badge variant="secondary">{query.count} searches</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Genres */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Genres</CardTitle>
              <CardDescription>Most filtered genres in search</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topGenres.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No genre filter data available</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topGenres.map((genre, index) => (
                    <div key={genre.genre} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{genre.genre}</span>
                      </div>
                      <Badge variant="outline">{genre.count} filters</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Search Trends (Last 7 Days)</CardTitle>
              <CardDescription>Daily search volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.searchTrends.map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{new Date(trend.date).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.max(5, (trend.searches / Math.max(...analytics.searchTrends.map((t) => t.searches))) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{trend.searches}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
