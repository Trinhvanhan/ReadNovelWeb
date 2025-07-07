import { requireAdmin } from "@/lib/admin"
import { emailService } from "@/lib/email"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Mail, Send, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default async function AdminNotificationsPage() {
  await requireAdmin()
  const notifications = await emailService.getNotifications()

  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === "sent").length,
    pending: notifications.filter((n) => n.status === "pending").length,
    failed: notifications.filter((n) => n.status === "failed").length,
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

            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Email Notifications</h1>
          <p className="text-muted-foreground">Monitor and manage email notifications sent to users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest email notifications sent to users</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">Email notifications will appear here once sent</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.slice(0, 20).map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{notification.subject}</h3>
                        <Badge
                          variant={
                            notification.status === "sent"
                              ? "default"
                              : notification.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {notification.status}
                        </Badge>
                        <Badge variant="outline">{notification.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>To: {notification.to}</span>
                        <span>Sent: {new Date(notification.createdAt).toLocaleString()}</span>
                        {notification.sentAt && (
                          <span>Delivered: {new Date(notification.sentAt).toLocaleString()}</span>
                        )}
                      </div>
                      {notification.error && <p className="text-sm text-red-600 mt-1">Error: {notification.error}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.status === "sent" && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {notification.status === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                      {notification.status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
