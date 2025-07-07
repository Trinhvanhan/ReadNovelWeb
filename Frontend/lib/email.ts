export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailNotification {
  id: string
  to: string
  subject: string
  html: string
  text: string
  type: NotificationType
  status: "pending" | "sent" | "failed"
  createdAt: string
  sentAt?: string
  error?: string
}

export type NotificationType =
  | "welcome"
  | "new_chapter"
  | "novel_completed"
  | "reading_milestone"
  | "admin_new_user"
  | "admin_new_novel"
  | "password_reset"
  | "account_verification"

// Mock email service - in production, use services like SendGrid, Mailgun, etc.
class EmailService {
  private notifications: EmailNotification[] = []

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
    type: NotificationType,
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const notification: EmailNotification = {
        id: Date.now().toString(),
        to,
        subject,
        html,
        text,
        type,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      this.notifications.push(notification)

      // Simulate email sending delay
      setTimeout(() => {
        const index = this.notifications.findIndex((n) => n.id === notification.id)
        if (index !== -1) {
          this.notifications[index].status = "sent"
          this.notifications[index].sentAt = new Date().toISOString()
        }
      }, 1000)

      console.log(`📧 Email sent to ${to}: ${subject}`)
      return { success: true, id: notification.id }
    } catch (error) {
      console.error("Failed to send email:", error)
      return { success: false, error: "Failed to send email" }
    }
  }

  async getNotifications(): Promise<EmailNotification[]> {
    return this.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getNotificationById(id: string): Promise<EmailNotification | null> {
    return this.notifications.find((n) => n.id === id) || null
  }
}

export const emailService = new EmailService()

// Email templates
export const emailTemplates = {
  welcome: (userName: string): EmailTemplate => ({
    subject: "Welcome to NovelReader! 📚",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">📚 NovelReader</h1>
        </div>
        
        <h2 style="color: #1f2937;">Welcome, ${userName}! 🎉</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for joining NovelReader! We're excited to have you as part of our reading community.
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Get Started:</h3>
          <ul style="color: #4b5563; line-height: 1.6;">
            <li>Browse our extensive library of novels</li>
            <li>Create your personal reading list</li>
            <li>Track your reading progress</li>
            <li>Discover new authors and genres</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/library" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Explore Library
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Happy reading!<br>
          The NovelReader Team
        </p>
      </div>
    `,
    text: `Welcome to NovelReader, ${userName}!\n\nThank you for joining our reading community. Start exploring our library at ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/library\n\nHappy reading!\nThe NovelReader Team`,
  }),

  newChapter: (
    userName: string,
    novelTitle: string,
    chapterTitle: string,
    chapterNumber: number,
    novelId: string,
  ): EmailTemplate => ({
    subject: `📖 New Chapter: ${novelTitle} - Chapter ${chapterNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">📚 NovelReader</h1>
        </div>
        
        <h2 style="color: #1f2937;">New Chapter Available! 📖</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Hi ${userName},
        </p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Great news! A new chapter has been published for one of your favorite novels.
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">${novelTitle}</h3>
          <p style="color: #4b5563; margin: 10px 0;">
            <strong>Chapter ${chapterNumber}:</strong> ${chapterTitle}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/read/${novelId}/${chapterNumber}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Read Now
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Don't want these notifications? <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings">Update your preferences</a>
        </p>
      </div>
    `,
    text: `New Chapter Available!\n\n${novelTitle} - Chapter ${chapterNumber}: ${chapterTitle}\n\nRead now: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/read/${novelId}/${chapterNumber}\n\nUpdate preferences: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings`,
  }),

  novelCompleted: (userName: string, novelTitle: string, novelId: string): EmailTemplate => ({
    subject: `🎉 Novel Completed: ${novelTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">📚 NovelReader</h1>
        </div>
        
        <h2 style="color: #1f2937;">Novel Completed! 🎉</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Hi ${userName},
        </p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Exciting news! "${novelTitle}" has been completed and all chapters are now available.
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #1f2937; margin-top: 0;">🏆 ${novelTitle}</h3>
          <p style="color: #4b5563;">The complete story is ready for you to enjoy!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/novel/${novelId}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Read Complete Novel
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Don't want these notifications? <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings">Update your preferences</a>
        </p>
      </div>
    `,
    text: `Novel Completed!\n\n"${novelTitle}" has been completed and all chapters are now available.\n\nRead the complete novel: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/novel/${novelId}\n\nUpdate preferences: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings`,
  }),

  readingMilestone: (userName: string, milestone: string, novelTitle: string): EmailTemplate => ({
    subject: `🏆 Reading Milestone: ${milestone}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">📚 NovelReader</h1>
        </div>
        
        <h2 style="color: #1f2937;">Congratulations! 🏆</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Hi ${userName},
        </p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          You've reached an amazing reading milestone!
        </p>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0; font-size: 24px;">🎉 ${milestone}</h3>
          <p style="margin: 10px 0; opacity: 0.9;">in "${novelTitle}"</p>
        </div>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Keep up the great reading! Every page brings new adventures and discoveries.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/library" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Continue Reading
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Happy reading!<br>
          The NovelReader Team
        </p>
      </div>
    `,
    text: `Congratulations ${userName}!\n\nYou've reached: ${milestone} in "${novelTitle}"\n\nKeep up the great reading!\n\nContinue at: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/library`,
  }),

  adminNewUser: (adminName: string, newUserName: string, newUserEmail: string): EmailTemplate => ({
    subject: "👤 New User Registration",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">📚 NovelReader Admin</h1>
        </div>
        
        <h2 style="color: #1f2937;">New User Registration 👤</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Hi ${adminName},
        </p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          A new user has registered on NovelReader.
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">User Details:</h3>
          <p style="color: #4b5563; margin: 5px 0;"><strong>Name:</strong> ${newUserName}</p>
          <p style="color: #4b5563; margin: 5px 0;"><strong>Email:</strong> ${newUserEmail}</p>
          <p style="color: #4b5563; margin: 5px 0;"><strong>Registered:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Admin Dashboard
          </a>
        </div>
      </div>
    `,
    text: `New User Registration\n\nName: ${newUserName}\nEmail: ${newUserEmail}\nRegistered: ${new Date().toLocaleDateString()}\n\nView admin dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin`,
  }),

  adminNewNovel: (adminName: string, novelTitle: string, authorName: string): EmailTemplate => ({
    subject: "📚 New Novel Published",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">📚 NovelReader Admin</h1>
        </div>
        
        <h2 style="color: #1f2937;">New Novel Published 📚</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Hi ${adminName},
        </p>
        
        <p style="color: #4b5563; line-height: 1.6;">
          A new novel has been published on NovelReader.
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Novel Details:</h3>
          <p style="color: #4b5563; margin: 5px 0;"><strong>Title:</strong> ${novelTitle}</p>
          <p style="color: #4b5563; margin: 5px 0;"><strong>Author:</strong> ${authorName}</p>
          <p style="color: #4b5563; margin: 5px 0;"><strong>Published:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/novels" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Manage Novels
          </a>
        </div>
      </div>
    `,
    text: `New Novel Published\n\nTitle: ${novelTitle}\nAuthor: ${authorName}\nPublished: ${new Date().toLocaleDateString()}\n\nManage novels: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/novels`,
  }),
}
