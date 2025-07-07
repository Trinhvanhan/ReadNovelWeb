// In-memory database simulation
// In production, replace with actual database (MongoDB, PostgreSQL, etc.)

class Database {
  constructor() {
    this.users = []
    this.novels = []
    this.chapters = []
    this.readingProgress = []
    this.bookmarks = []
    this.notifications = []
    this.searchHistory = []
    this.init()
  }

  init() {
    // Initialize with sample data
    this.users = [
      {
        id: "1",
        email: "admin@example.com",
        username: "admin",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewS6/cSQpvQJbxzi",
        role: "admin",
        avatar: null,
        preferences: {
          theme: "system",
          fontSize: 16,
          fontFamily: "serif",
          lineHeight: 1.6,
          readingMode: "paginated",
        },
        notifications: {
          email: true,
          push: true,
          sms: false,
          newChapters: true,
          reminders: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    this.novels = [
      {
        id: "1",
        title: "The Chronicles of Eternity",
        author: "Alexandra Stone",
        description: "An epic fantasy saga spanning multiple realms and generations.",
        genre: "Fantasy",
        status: "ongoing",
        coverImage: "/placeholder.svg?height=300&width=200",
        tags: ["fantasy", "epic", "magic", "adventure"],
        totalChapters: 25,
        viewCount: 15420,
        rating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    this.chapters = [
      {
        id: "1",
        novelId: "1",
        title: "The Awakening",
        content: "In the beginning, there was only darkness. But from that darkness, light emerged...",
        chapterNumber: 1,
        wordCount: 2340,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  // User methods
  findUser(criteria) {
    return this.users.find((user) => {
      return Object.keys(criteria).every((key) => user[key] === criteria[key])
    })
  }

  createUser(userData) {
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.users.push(user)
    return user
  }

  updateUser(id, updateData) {
    const userIndex = this.users.findIndex((u) => u.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    return this.users[userIndex]
  }

  // Novel methods
  findNovels(criteria = {}) {
    return this.novels.filter((novel) => {
      return Object.keys(criteria).every((key) => {
        if (key === "search") {
          const searchTerm = criteria[key].toLowerCase()
          return (
            novel.title.toLowerCase().includes(searchTerm) ||
            novel.author.toLowerCase().includes(searchTerm) ||
            novel.description.toLowerCase().includes(searchTerm)
          )
        }
        return novel[key] === criteria[key]
      })
    })
  }

  findNovel(id) {
    return this.novels.find((n) => n.id === id)
  }

  createNovel(novelData) {
    const novel = {
      id: Date.now().toString(),
      ...novelData,
      viewCount: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.novels.push(novel)
    return novel
  }

  // Chapter methods
  findChapters(novelId) {
    return this.chapters.filter((c) => c.novelId === novelId)
  }

  findChapter(novelId, chapterNumber) {
    return this.chapters.find((c) => c.novelId === novelId && c.chapterNumber === chapterNumber)
  }

  createChapter(chapterData) {
    const chapter = {
      id: Date.now().toString(),
      ...chapterData,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.chapters.push(chapter)
    return chapter
  }

  // Reading progress methods
  findProgress(userId, novelId = null) {
    if (novelId) {
      return this.readingProgress.find((p) => p.userId === userId && p.novelId === novelId)
    }
    return this.readingProgress.filter((p) => p.userId === userId)
  }

  updateProgress(userId, progressData) {
    const existingIndex = this.readingProgress.findIndex(
      (p) => p.userId === userId && p.novelId === progressData.novelId,
    )

    const progress = {
      id: existingIndex >= 0 ? this.readingProgress[existingIndex].id : Date.now().toString(),
      userId,
      ...progressData,
      updatedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      this.readingProgress[existingIndex] = progress
    } else {
      progress.createdAt = new Date().toISOString()
      this.readingProgress.push(progress)
    }

    return progress
  }

  // Bookmark methods
  findBookmarks(userId) {
    return this.bookmarks.filter((b) => b.userId === userId)
  }

  createBookmark(userId, bookmarkData) {
    const bookmark = {
      id: Date.now().toString(),
      userId,
      ...bookmarkData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.bookmarks.push(bookmark)
    return bookmark
  }

  deleteBookmark(userId, bookmarkId) {
    const index = this.bookmarks.findIndex((b) => b.id === bookmarkId && b.userId === userId)
    if (index === -1) return false
    this.bookmarks.splice(index, 1)
    return true
  }
}

module.exports = new Database()
