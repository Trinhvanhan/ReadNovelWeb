import { requireAuth } from "@/lib/auth"
import { getUserNotificationPreferences } from "@/lib/notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { NotificationSettings } from "@/components/settings/notification-settings"

export default async function SettingsPage() {
  const user = await requireAuth()
  const preferences = await getUserNotificationPreferences(user.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">NovelReader</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/library">
                <span className="text-sm text-muted-foreground hover:text-foreground">My Library</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and notifications</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <a
                      href="#notifications"
                      className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
                    >
                      Notifications
                    </a>
                    <a href="#account" className="block px-3 py-2 rounded-md hover:bg-muted text-muted-foreground">
                      Account
                    </a>
                    <a href="#privacy" className="block px-3 py-2 rounded-md hover:bg-muted text-muted-foreground">
                      Privacy
                    </a>
                    <a href="#reading" className="block px-3 py-2 rounded-md hover:bg-muted text-muted-foreground">
                      Reading Preferences
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notifications */}
              <Card id="notifications">
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what notifications you'd like to receive via email</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings preferences={preferences} />
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card id="account">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-muted-foreground">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <p className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card id="privacy">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Reading Activity</p>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your reading progress and reviews
                        </p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics</p>
                        <p className="text-sm text-muted-foreground">
                          Help improve NovelReader by sharing anonymous usage data
                        </p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reading Preferences */}
              <Card id="reading">
                <CardHeader>
                  <CardTitle>Reading Preferences</CardTitle>
                  <CardDescription>Customize your reading experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Default Font Size</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>Small</option>
                        <option selected>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Default Theme</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option selected>Light</option>
                        <option>Dark</option>
                        <option>Sepia</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-bookmark Progress</p>
                        <p className="text-sm text-muted-foreground">Automatically bookmark your reading position</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
