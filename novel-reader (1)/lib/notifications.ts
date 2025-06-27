import { emailService, emailTemplates } from "./email"
import type { User } from "./auth"

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  newChapters: boolean
  novelCompleted: boolean
  readingMilestones: boolean
  systemUpdates: boolean
  createdAt: string
  updatedAt: string
}

// Mock notification preferences storage
const notificationPreferences: NotificationPreferences[] = [
  {
    userId: "1",
    emailNotifications: true,
    newChapters: true,
    novelCompleted: true,
    readingMilestones: true,
    systemUpdates: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function getUserNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  const existing = notificationPreferences.find((p) => p.userId === userId)

  if (existing) {
    return existing
  }

  // Create default preferences for new users
  const defaultPrefs: NotificationPreferences = {
    userId,
    emailNotifications: true,
    newChapters: true,
    novelCompleted: true,
    readingMilestones: true,
    systemUpdates: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  notificationPreferences.push(defaultPrefs)
  return defaultPrefs
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const index = notificationPreferences.findIndex((p) => p.userId === userId)

  if (index === -1) {
    const newPrefs = await getUserNotificationPreferences(userId)
    return updateNotificationPreferences(userId, preferences)
  }

  notificationPreferences[index] = {
    ...notificationPreferences[index],
    ...preferences,
    updatedAt: new Date().toISOString(),
  }

  return notificationPreferences[index]
}

// Notification sending functions
export async function sendWelcomeEmail(user: User): Promise<void> {
  const preferences = await getUserNotificationPreferences(user.id)

  if (!preferences.emailNotifications) return

  const template = emailTemplates.welcome(user.name)
  await emailService.sendEmail(user.email, template.subject, template.html, template.text, "welcome")
}

export async function sendNewChapterNotification(
  novelId: string,
  novelTitle: string,
  chapterTitle: string,
  chapterNumber: number,
): Promise<void> {
  // In a real app, you'd get users who have this novel in their library
  // For demo, we'll use mock users
  const mockUsers = [{ id: "1", name: "Demo User", email: "demo@example.com" }]

  for (const user of mockUsers) {
    const preferences = await getUserNotificationPreferences(user.id)

    if (!preferences.emailNotifications || !preferences.newChapters) continue

    const template = emailTemplates.newChapter(user.name, novelTitle, chapterTitle, chapterNumber, novelId)

    await emailService.sendEmail(user.email, template.subject, template.html, template.text, "new_chapter")
  }
}

export async function sendNovelCompletedNotification(novelId: string, novelTitle: string): Promise<void> {
  // In a real app, you'd get users who have this novel in their library
  const mockUsers = [{ id: "1", name: "Demo User", email: "demo@example.com" }]

  for (const user of mockUsers) {
    const preferences = await getUserNotificationPreferences(user.id)

    if (!preferences.emailNotifications || !preferences.novelCompleted) continue

    const template = emailTemplates.novelCompleted(user.name, novelTitle, novelId)

    await emailService.sendEmail(user.email, template.subject, template.html, template.text, "novel_completed")
  }
}

export async function sendReadingMilestoneNotification(
  userId: string,
  milestone: string,
  novelTitle: string,
): Promise<void> {
  // Get user info (in real app, from database)
  const user = { id: userId, name: "Demo User", email: "demo@example.com" }
  const preferences = await getUserNotificationPreferences(userId)

  if (!preferences.emailNotifications || !preferences.readingMilestones) return

  const template = emailTemplates.readingMilestone(user.name, milestone, novelTitle)

  await emailService.sendEmail(user.email, template.subject, template.html, template.text, "reading_milestone")
}

export async function sendAdminNewUserNotification(newUser: User): Promise<void> {
  // Send to all admins
  const adminEmails = ["admin@novelreader.com"]

  for (const adminEmail of adminEmails) {
    const template = emailTemplates.adminNewUser("Admin", newUser.name, newUser.email)

    await emailService.sendEmail(adminEmail, template.subject, template.html, template.text, "admin_new_user")
  }
}

export async function sendAdminNewNovelNotification(novelTitle: string, authorName: string): Promise<void> {
  // Send to all admins
  const adminEmails = ["admin@novelreader.com"]

  for (const adminEmail of adminEmails) {
    const template = emailTemplates.adminNewNovel("Admin", novelTitle, authorName)

    await emailService.sendEmail(adminEmail, template.subject, template.html, template.text, "admin_new_novel")
  }
}

// Helper function to check reading milestones
export async function checkReadingMilestones(userId: string, novelId: string, newProgress: number): Promise<void> {
  const milestones = [
    { threshold: 25, message: "25% Complete" },
    { threshold: 50, message: "Halfway There!" },
    { threshold: 75, message: "75% Complete" },
    { threshold: 100, message: "Novel Completed!" },
  ]

  // Get previous progress (in real app, from database)
  const previousProgress = 0 // Mock previous progress

  for (const milestone of milestones) {
    if (newProgress >= milestone.threshold && previousProgress < milestone.threshold) {
      // Get novel title (in real app, from database)
      const novelTitle = "The Midnight Chronicles" // Mock novel title

      await sendReadingMilestoneNotification(userId, milestone.message, novelTitle)
    }
  }
}
