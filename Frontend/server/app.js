const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const compression = require("compression")
const morgan = require("morgan")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { createServer } = require("http")
const { Server } = require("socket.io")
const Redis = require("redis")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")

// Initialize Express app
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
})

// Initialize Redis client
const redis = Redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
})

redis.on("error", (err) => console.log("Redis Client Error", err))
redis.connect().catch(console.error)

// Email transporter
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// In-memory database simulation (replace with actual database)
const database = {
  users: [],
  novels: [],
  chapters: [],
  readingProgress: [],
  bookmarks: [],
  notifications: [],
  searchHistory: [],
  analytics: {
    searches: [],
    userActivity: [],
    contentViews: [],
  },
}

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)
app.use(compression())
app.use(morgan("combined"))
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Rate limiting configurations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { error: { code: "RATE_LIMITED", message: "Too many authentication attempts" } },
  standardHeaders: true,
  legacyHeaders: false,
})

const searchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  message: { error: { code: "RATE_LIMITED", message: "Too many search requests" } },
})

const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour
  message: { error: { code: "RATE_LIMITED", message: "Too many requests" } },
})

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: { error: { code: "RATE_LIMITED", message: "Too many upload requests" } },
})

// Apply rate limiting
app.use("/api/auth", authLimiter)
app.use("/api/search", searchLimiter)
app.use("/api/upload", uploadLimiter)
app.use("/api/", generalLimiter)

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || "uploads"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Utility functions
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  })
}

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  })
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12)
}

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

const generateRequestId = () => {
  return "req_" + uuidv4().replace(/-/g, "").substring(0, 12)
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Access token required",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: {
          code: "TOKEN_EXPIRED",
          message: "Token has expired",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }
    return res.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "Invalid or expired token",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
}

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "Admin access required",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
  next()
}

// Initialize sample data
const initializeData = () => {
  // Sample users
  database.users = [
    {
      id: "user_123",
      name: "John Doe",
      email: "admin@example.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewS6/cSQpvQJbxzi", // 'password'
      avatar: null,
      role: "admin",
      createdAt: "2024-01-01T00:00:00Z",
      lastLoginAt: "2024-01-15T10:30:00Z",
      preferences: {
        theme: "dark",
        fontSize: "large",
        autoBookmark: true,
        notifications: {
          email: true,
          push: false,
          newChapters: true,
          recommendations: false,
        },
      },
      stats: {
        novelsRead: 25,
        chaptersRead: 1250,
        totalReadingTime: 75600,
        favoriteGenres: ["fantasy", "sci-fi", "romance"],
      },
    },
    {
      id: "user_456",
      name: "Jane Smith",
      email: "user@example.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewS6/cSQpvQJbxzi", // 'password'
      avatar: null,
      role: "user",
      createdAt: "2024-01-02T00:00:00Z",
      lastLoginAt: "2024-01-14T09:15:00Z",
      preferences: {
        theme: "light",
        fontSize: "medium",
        autoBookmark: false,
        notifications: {
          email: false,
          push: true,
          newChapters: true,
          recommendations: true,
        },
      },
      stats: {
        novelsRead: 12,
        chaptersRead: 480,
        totalReadingTime: 28800,
        favoriteGenres: ["romance", "mystery"],
      },
    },
  ]

  // Sample novels
  database.novels = [
    {
      id: "novel_123",
      title: "The Chronicles of Aetheria",
      author: "Jane Smith",
      description:
        "An epic fantasy adventure in a magical realm where young Aria discovers her magical abilities and embarks on a quest to save her kingdom from an ancient evil.",
      coverImage: "/placeholder.svg?height=300&width=200",
      genres: ["fantasy", "adventure", "magic"],
      tags: ["dragons", "magic system", "coming of age", "female protagonist"],
      status: "ongoing",
      language: "en",
      rating: 4.7,
      ratingCount: 1250,
      viewCount: 50000,
      favoriteCount: 3200,
      chapterCount: 45,
      wordCount: 180000,
      lastUpdated: "2024-01-15T08:00:00Z",
      createdAt: "2023-06-01T00:00:00Z",
      isCompleted: false,
      isPremium: false,
    },
    {
      id: "novel_456",
      title: "Digital Hearts",
      author: "Marcus Chen",
      description:
        "A cyberpunk romance set in Neo-Tokyo 2087, where love transcends the boundaries between human and artificial intelligence.",
      coverImage: "/placeholder.svg?height=300&width=200",
      genres: ["sci-fi", "romance", "cyberpunk"],
      tags: ["AI", "future", "technology", "love story"],
      status: "completed",
      language: "en",
      rating: 4.3,
      ratingCount: 892,
      viewCount: 28000,
      favoriteCount: 1800,
      chapterCount: 32,
      wordCount: 120000,
      lastUpdated: "2024-01-10T12:00:00Z",
      createdAt: "2023-08-15T00:00:00Z",
      isCompleted: true,
      isPremium: false,
    },
  ]

  // Sample chapters
  database.chapters = [
    {
      id: "chapter_789",
      novelId: "novel_123",
      number: 1,
      title: "The Awakening",
      content:
        "The morning sun cast long shadows across the village square as Aria stepped out of her cottage. Little did she know that this day would change her life forever. The ancient magic that had been dormant in her bloodline for generations was about to awaken, setting her on a path that would determine the fate of the entire kingdom.",
      wordCount: 4200,
      publishedAt: "2023-06-01T00:00:00Z",
      updatedAt: "2023-06-01T00:00:00Z",
      isLocked: false,
    },
    {
      id: "chapter_790",
      novelId: "novel_123",
      number: 2,
      title: "First Steps",
      content:
        "The revelation of her magical abilities left Aria reeling. The village elder, Master Thorne, had explained the ancient prophecy that spoke of a chosen one who would rise when darkness threatened the land. As Aria practiced her newfound powers, she began to understand the weight of her destiny.",
      wordCount: 3800,
      publishedAt: "2023-06-03T00:00:00Z",
      updatedAt: "2023-06-03T00:00:00Z",
      isLocked: false,
    },
  ]

  // Sample reading progress
  database.readingProgress = [
    {
      novelId: "novel_123",
      userId: "user_456",
      currentChapter: 12,
      currentPosition: 0.65,
      lastReadAt: "2024-01-15T10:30:00Z",
      totalReadingTime: 7200,
      progressPercentage: 0.27,
      isCompleted: false,
    },
  ]

  // Sample bookmarks
  database.bookmarks = [
    {
      id: "bookmark_456",
      userId: "user_456",
      novelId: "novel_123",
      chapterNumber: 8,
      position: 0.45,
      note: "Important plot twist here!",
      createdAt: "2024-01-10T15:20:00Z",
    },
  ]

  // Sample notifications
  database.notifications = [
    {
      id: "notif_789",
      userId: "user_456",
      type: "new_chapter",
      title: "New Chapter Available",
      message: 'Chapter 46 of "The Chronicles of Aetheria" is now available!',
      data: {
        novelId: "novel_123",
        novelTitle: "The Chronicles of Aetheria",
        chapterNumber: 46,
        chapterTitle: "The Final Battle",
      },
      priority: "medium",
      isRead: false,
      createdAt: "2024-01-15T08:00:00Z",
      readAt: null,
      actions: [
        {
          type: "read_chapter",
          label: "Read Now",
          url: "/read/novel_123/46",
        },
        {
          type: "mark_read",
          label: "Mark as Read",
        },
      ],
    },
  ]
}

// Initialize data on startup
initializeData()

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.2.0",
    environment: process.env.NODE_ENV || "development",
  })
})

// Authentication routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Name, email, and password are required",
          details: [
            { field: "name", message: "Name is required" },
            { field: "email", message: "Email is required" },
            { field: "password", message: "Password is required" },
          ].filter((detail) => !req.body[detail.field.split(".")[0]]),
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Password must be at least 6 characters",
          details: [{ field: "password", message: "Password must be at least 6 characters" }],
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Check if user exists
    const existingUser = database.users.find((u) => u.email === email)
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: "CONFLICT",
          message: "User already exists",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = {
      id: "user_" + Date.now(),
      name,
      email,
      password: hashedPassword,
      avatar: null,
      role: "user",
      createdAt: new Date().toISOString(),
      preferences: {
        theme: "light",
        fontSize: "medium",
        autoBookmark: true,
        notifications: {
          email: true,
          push: false,
          newChapters: true,
          recommendations: true,
        },
      },
      stats: {
        novelsRead: 0,
        chaptersRead: 0,
        totalReadingTime: 0,
        favoriteGenres: [],
      },
    }

    database.users.push(user)

    // Generate tokens
    const token = generateToken({ userId: user.id, email: user.email, role: user.role })
    const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour

    // Cache refresh token
    await redis.set(`refresh_token:${user.id}`, token, { EX: 7 * 24 * 60 * 60 })

    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({
      user: userWithoutPassword,
      token,
      expiresAt,
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
          details: [
            { field: "email", message: "Email is required" },
            { field: "password", message: "Password is required" },
          ].filter((detail) => !req.body[detail.field]),
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Find user
    const user = database.users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Verify password
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString()

    // Generate tokens
    const token = generateToken({ userId: user.id, email: user.email, role: user.role })
    const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour

    // Cache refresh token
    await redis.set(`refresh_token:${user.id}`, token, { EX: 7 * 24 * 60 * 60 })

    const { password: _, ...userWithoutPassword } = user
    res.json({
      user: userWithoutPassword,
      token,
      expiresAt,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.post("/api/auth/refresh", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"]
    const refreshToken = authHeader && authHeader.split(" ")[1]

    if (!refreshToken) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Refresh token required",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // Check if refresh token exists in cache
    const cachedToken = await redis.get(`refresh_token:${decoded.userId}`)
    if (!cachedToken) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid refresh token",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Find user
    const user = database.users.find((u) => u.id === decoded.userId)
    if (!user) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "User not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Generate new tokens
    const newToken = generateToken({ userId: user.id, email: user.email, role: user.role })
    const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour

    // Update refresh token in cache
    await redis.set(`refresh_token:${user.id}`, newToken, { EX: 7 * 24 * 60 * 60 })

    res.json({
      token: newToken,
      expiresAt,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    // Remove refresh token from cache
    await redis.del(`refresh_token:${req.user.userId}`)
    res.json({ message: "Successfully logged out" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.get("/api/auth/me", authenticateToken, (req, res) => {
  try {
    const user = database.users.find((u) => u.id === req.user.userId)
    if (!user) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "User not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    const { password, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// User management routes
app.patch("/api/user/profile", authenticateToken, upload.single("avatar"), async (req, res) => {
  try {
    const { name, avatar } = req.body
    const userId = req.user.userId

    const user = database.users.find((u) => u.id === userId)
    if (!user) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "User not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Update fields
    if (name) user.name = name
    if (avatar) user.avatar = avatar

    // Handle avatar upload
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`
    }

    user.updatedAt = new Date().toISOString()

    const { password, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.patch("/api/user/preferences", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const preferences = req.body

    const user = database.users.find((u) => u.id === userId)
    if (!user) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "User not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    user.preferences = { ...user.preferences, ...preferences }
    user.updatedAt = new Date().toISOString()

    res.json({
      preferences: user.preferences,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    console.error("Preferences update error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// Novel routes
app.get("/api/novels", (req, res) => {
  try {
    const { page = 1, limit = 20, genre, status, language, sortBy = "popularity", sortOrder = "desc" } = req.query

    let novels = [...database.novels]

    // Apply filters
    if (genre) {
      novels = novels.filter((n) => n.genres.includes(genre.toLowerCase()))
    }

    if (status) {
      novels = novels.filter((n) => n.status === status)
    }

    if (language) {
      novels = novels.filter((n) => n.language === language)
    }

    // Apply sorting
    novels.sort((a, b) => {
      let aVal, bVal

      switch (sortBy) {
        case "title":
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case "rating":
          aVal = a.rating
          bVal = b.rating
          break
        case "popularity":
          aVal = a.viewCount
          bVal = b.viewCount
          break
        case "updated":
          aVal = new Date(a.lastUpdated)
          bVal = new Date(b.lastUpdated)
          break
        case "created":
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
          break
        default:
          aVal = a.viewCount
          bVal = b.viewCount
      }

      if (sortOrder === "desc") {
        return bVal > aVal ? 1 : -1
      } else {
        return aVal > bVal ? 1 : -1
      }
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedNovels = novels.slice(startIndex, endIndex)

    res.json({
      novels: paginatedNovels,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(novels.length / limit),
        totalCount: novels.length,
        hasNext: endIndex < novels.length,
        hasPrev: startIndex > 0,
      },
      filters: {
        availableGenres: [...new Set(database.novels.flatMap((n) => n.genres))],
        availableLanguages: [...new Set(database.novels.map((n) => n.language))],
        availableStatuses: [...new Set(database.novels.map((n) => n.status))],
      },
    })
  } catch (error) {
    console.error("Get novels error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.get("/api/novels/:id", (req, res) => {
  try {
    const { id } = req.params
    const novel = database.novels.find((n) => n.id === id)

    if (!novel) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Novel not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Get chapters for this novel
    const chapters = database.chapters
      .filter((c) => c.novelId === id)
      .sort((a, b) => a.number - b.number)
      .map(({ content, ...chapter }) => chapter) // Exclude content from list

    // Get user interaction if authenticated
    let userInteraction = null
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = verifyToken(token)
        const progress = database.readingProgress.find((p) => p.userId === decoded.userId && p.novelId === id)
        userInteraction = {
          isFavorited: false, // Would check favorites table
          isFollowing: false, // Would check follows table
          rating: null, // Would check ratings table
          lastReadChapter: progress?.currentChapter || null,
          readingProgress: progress?.progressPercentage || 0,
        }
      } catch (err) {
        // Ignore token errors for public access
      }
    }

    const novelWithDetails = {
      ...novel,
      chapters,
      author: {
        id: "author_456",
        name: novel.author,
        avatar: null,
        bio: "Acclaimed fantasy author with multiple bestselling series.",
        novelCount: 3,
        followerCount: 15000,
      },
      userInteraction,
    }

    res.json(novelWithDetails)
  } catch (error) {
    console.error("Get novel error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.get("/api/novels/:id/chapters/:chapter", (req, res) => {
  try {
    const { id, chapter } = req.params
    const chapterNumber = Number.parseInt(chapter)

    const novel = database.novels.find((n) => n.id === id)
    if (!novel) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Novel not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    const chapterData = database.chapters.find((c) => c.novelId === id && c.number === chapterNumber)

    if (!chapterData) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Chapter not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Get adjacent chapters
    const allChapters = database.chapters.filter((c) => c.novelId === id).sort((a, b) => a.number - b.number)

    const currentIndex = allChapters.findIndex((c) => c.number === chapterNumber)
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null

    res.json({
      ...chapterData,
      navigation: {
        previousChapter: prevChapter
          ? {
              number: prevChapter.number,
              title: prevChapter.title,
              isLocked: prevChapter.isLocked,
            }
          : null,
        nextChapter: nextChapter
          ? {
              number: nextChapter.number,
              title: nextChapter.title,
              isLocked: nextChapter.isLocked,
            }
          : null,
      },
      novel: {
        id: novel.id,
        title: novel.title,
        author: novel.author,
        coverImage: novel.coverImage,
      },
    })
  } catch (error) {
    console.error("Get chapter error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// Reading progress routes
app.get("/api/reading/progress", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const progress = database.readingProgress.filter((p) => p.userId === userId)

    // Enrich with novel data
    const enrichedProgress = progress.map((p) => {
      const novel = database.novels.find((n) => n.id === p.novelId)
      return {
        ...p,
        novel: novel
          ? {
              id: novel.id,
              title: novel.title,
              author: novel.author,
              coverImage: novel.coverImage,
              chapterCount: novel.chapterCount,
            }
          : null,
      }
    })

    // Calculate stats
    const stats = {
      totalNovels: enrichedProgress.length,
      completedNovels: enrichedProgress.filter((p) => p.isCompleted).length,
      totalChapters: enrichedProgress.reduce((sum, p) => sum + (p.currentChapter || 0), 0),
      totalReadingTime: enrichedProgress.reduce((sum, p) => sum + (p.totalReadingTime || 0), 0),
      averageReadingSpeed: 250, // words per minute
    }

    res.json({
      progress: enrichedProgress,
      stats,
    })
  } catch (error) {
    console.error("Get reading progress error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.post("/api/reading/progress", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { novelId, chapterNumber, position, readingTime } = req.body

    if (!novelId || !chapterNumber || position === undefined) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Novel ID, chapter number, and position are required",
          details: [
            { field: "novelId", message: "Novel ID is required" },
            { field: "chapterNumber", message: "Chapter number is required" },
            { field: "position", message: "Position is required" },
          ].filter((detail) => req.body[detail.field.split(".")[0]] === undefined),
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Find existing progress
    const existingIndex = database.readingProgress.findIndex((p) => p.userId === userId && p.novelId === novelId)

    const novel = database.novels.find((n) => n.id === novelId)
    const progressPercentage = novel ? chapterNumber / novel.chapterCount : 0

    const progressData = {
      novelId,
      userId,
      currentChapter: chapterNumber,
      currentPosition: position,
      lastReadAt: new Date().toISOString(),
      totalReadingTime: readingTime || 0,
      progressPercentage,
      isCompleted: progressPercentage >= 1.0,
    }

    if (existingIndex >= 0) {
      database.readingProgress[existingIndex] = {
        ...database.readingProgress[existingIndex],
        ...progressData,
        totalReadingTime: (database.readingProgress[existingIndex].totalReadingTime || 0) + (readingTime || 0),
      }
    } else {
      database.readingProgress.push(progressData)
    }

    // Check for milestones
    let milestone = null
    if (chapterNumber % 10 === 0) {
      milestone = {
        type: "chapter_milestone",
        message: `You've read ${chapterNumber} chapters! Keep going!`,
        reward: "achievement_badge",
      }
    }

    res.json({
      ...progressData,
      milestone,
    })
  } catch (error) {
    console.error("Update reading progress error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// Bookmarks routes
app.get("/api/reading/bookmarks", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 20, novelId } = req.query

    let bookmarks = database.bookmarks.filter((b) => b.userId === userId)

    if (novelId) {
      bookmarks = bookmarks.filter((b) => b.novelId === novelId)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedBookmarks = bookmarks.slice(startIndex, endIndex)

    // Enrich with novel and chapter data
    const enrichedBookmarks = paginatedBookmarks.map((b) => {
      const novel = database.novels.find((n) => n.id === b.novelId)
      const chapter = database.chapters.find((c) => c.novelId === b.novelId && c.number === b.chapterNumber)

      return {
        ...b,
        novel: novel
          ? {
              id: novel.id,
              title: novel.title,
              author: novel.author,
              coverImage: novel.coverImage,
            }
          : null,
        chapter: chapter
          ? {
              number: chapter.number,
              title: chapter.title,
              excerpt: chapter.content.substring(0, 100) + "...",
            }
          : null,
      }
    })

    res.json({
      bookmarks: enrichedBookmarks,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(bookmarks.length / limit),
        totalCount: bookmarks.length,
        hasNext: endIndex < bookmarks.length,
        hasPrev: startIndex > 0,
      },
    })
  } catch (error) {
    console.error("Get bookmarks error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.post("/api/reading/bookmarks", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { novelId, chapterNumber, position, note } = req.body

    if (!novelId || !chapterNumber || position === undefined) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Novel ID, chapter number, and position are required",
          details: [
            { field: "novelId", message: "Novel ID is required" },
            { field: "chapterNumber", message: "Chapter number is required" },
            { field: "position", message: "Position is required" },
          ].filter((detail) => req.body[detail.field.split(".")[0]] === undefined),
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    const bookmark = {
      id: "bookmark_" + Date.now(),
      userId,
      novelId,
      chapterNumber,
      position,
      note: note || "",
      createdAt: new Date().toISOString(),
      isBookmarked: true,
    }

    database.bookmarks.push(bookmark)
    res.status(200).json(bookmark)
  } catch (error) {
    console.error("Create bookmark error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// Search routes
app.get("/api/search", (req, res) => {
  try {
    const {
      q: query,
      genres,
      status,
      rating,
      wordCount,
      language,
      tags,
      sortBy = "relevance",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query

    if (!query) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Search query is required",
          details: [{ field: "q", message: "Search query is required" }],
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    const searchTerm = query.toLowerCase()
    let results = []

    // Search novels
    const novelResults = database.novels
      .filter((novel) => {
        const matchesSearch =
          novel.title.toLowerCase().includes(searchTerm) ||
          novel.author.toLowerCase().includes(searchTerm) ||
          novel.description.toLowerCase().includes(searchTerm) ||
          novel.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

        // Apply filters
        const matchesGenres = !genres || genres.split(",").some((g) => novel.genres.includes(g.trim().toLowerCase()))
        const matchesStatus = !status || status.split(",").includes(novel.status)
        const matchesLanguage = !language || language.split(",").includes(novel.language)
        const matchesTags =
          !tags ||
          tags.split(",").some((t) => novel.tags.some((tag) => tag.toLowerCase().includes(t.trim().toLowerCase())))

        let matchesRating = true
        if (rating) {
          const [minRating, maxRating] = rating.split(",").map(Number)
          matchesRating = novel.rating >= minRating && novel.rating <= maxRating
        }

        return matchesSearch && matchesGenres && matchesStatus && matchesLanguage && matchesTags && matchesRating
      })
      .map((novel) => ({
        ...novel,
        relevanceScore: calculateRelevance(novel, searchTerm),
        matchedTerms: getMatchedTerms(novel, searchTerm),
        excerpt: getExcerpt(novel.description, searchTerm),
      }))

    results = novelResults

    // Apply sorting
    if (sortBy === "relevance") {
      results.sort((a, b) => b.relevanceScore - a.relevanceScore)
    } else if (sortBy === "rating") {
      results.sort((a, b) => (sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating))
    } else if (sortBy === "popularity") {
      results.sort((a, b) => (sortOrder === "desc" ? b.viewCount - a.viewCount : a.viewCount - b.viewCount))
    } else if (sortBy === "newest") {
      results.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB
      })
    } else if (sortBy === "updated") {
      results.sort((a, b) => {
        const dateA = new Date(a.lastUpdated)
        const dateB = new Date(b.lastUpdated)
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB
      })
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedResults = results.slice(startIndex, endIndex)

    // Generate facets
    const facets = {
      genres: [...new Set(database.novels.flatMap((n) => n.genres))].map((genre) => ({
        name: genre,
        count: database.novels.filter((n) => n.genres.includes(genre)).length,
      })),
      status: [...new Set(database.novels.map((n) => n.status))].map((status) => ({
        name: status,
        count: database.novels.filter((n) => n.status === status).length,
      })),
    }

    // Generate suggestions
    const suggestions = generateSearchSuggestions(query)

    res.json({
      results: paginatedResults,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(results.length / limit),
        totalCount: results.length,
        hasNext: endIndex < results.length,
        hasPrev: startIndex > 0,
      },
      searchInfo: {
        query,
        executionTime: 0.045,
        appliedFilters: {
          genres: genres ? genres.split(",") : [],
          status: status ? status.split(",") : [],
          rating: rating ? rating.split(",").map(Number) : [],
        },
        suggestions,
      },
      facets,
    })
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.get("/api/search/suggestions", (req, res) => {
  try {
    const { q: query } = req.query

    if (!query) {
      return res.json({ suggestions: [] })
    }

    const searchTerm = query.toLowerCase()
    const suggestions = []

    // Novel title suggestions
    database.novels.forEach((novel) => {
      if (novel.title.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          text: novel.title,
          type: "novel",
          id: novel.id,
          author: novel.author,
          coverImage: novel.coverImage,
        })
      }
    })

    // Author suggestions
    const authors = [...new Set(database.novels.map((n) => n.author))]
    authors.forEach((author) => {
      if (author.toLowerCase().includes(searchTerm)) {
        const novelCount = database.novels.filter((n) => n.author === author).length
        suggestions.push({
          text: author,
          type: "author",
          novelCount,
        })
      }
    })

    // Query suggestions
    const commonQueries = [
      "fantasy magic system",
      "romance modern",
      "sci-fi space opera",
      "mystery detective",
      "adventure quest",
    ]

    commonQueries.forEach((queryText) => {
      if (queryText.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          text: queryText,
          type: "query",
          popularity: Math.floor(Math.random() * 1000),
        })
      }
    })

    // Limit and sort suggestions
    const limitedSuggestions = suggestions.slice(0, 10).sort((a, b) => {
      if (a.type === "novel" && b.type !== "novel") return -1
      if (a.type !== "novel" && b.type === "novel") return 1
      return 0
    })

    res.json({ suggestions: limitedSuggestions })
  } catch (error) {
    console.error("Search suggestions error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// Notifications routes
app.get("/api/notifications", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 20, type, read, priority } = req.query

    let notifications = database.notifications.filter((n) => n.userId === userId)

    // Apply filters
    if (type) {
      notifications = notifications.filter((n) => n.type === type)
    }

    if (read !== undefined) {
      const isRead = read === "true"
      notifications = notifications.filter((n) => n.isRead === isRead)
    }

    if (priority) {
      notifications = notifications.filter((n) => n.priority === priority)
    }

    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedNotifications = notifications.slice(startIndex, endIndex)

    // Calculate summary
    const summary = {
      unreadCount: database.notifications.filter((n) => n.userId === userId && !n.isRead).length,
      totalCount: database.notifications.filter((n) => n.userId === userId).length,
      typeBreakdown: {},
    }

    // Calculate type breakdown
    const userNotifications = database.notifications.filter((n) => n.userId === userId)
    userNotifications.forEach((n) => {
      summary.typeBreakdown[n.type] = (summary.typeBreakdown[n.type] || 0) + 1
    })

    res.json({
      notifications: paginatedNotifications,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(notifications.length / limit),
        totalCount: notifications.length,
        hasNext: endIndex < notifications.length,
        hasPrev: startIndex > 0,
      },
      summary,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.post("/api/notifications/read", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { ids } = req.body

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Notification IDs array is required",
          details: [{ field: "ids", message: "IDs must be an array" }],
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    let markedAsRead = 0
    const updatedAt = new Date().toISOString()

    ids.forEach((id) => {
      const notification = database.notifications.find((n) => n.id === id && n.userId === userId)
      if (notification && !notification.isRead) {
        notification.isRead = true
        notification.readAt = updatedAt
        markedAsRead++
      }
    })

    res.json({
      markedAsRead,
      updatedAt,
    })
  } catch (error) {
    console.error("Mark notifications read error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.patch("/api/notifications/preferences", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const preferences = req.body

    const user = database.users.find((u) => u.id === userId)
    if (!user) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "User not found",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    // Update notification preferences
    if (!user.notificationPreferences) {
      user.notificationPreferences = {}
    }

    user.notificationPreferences = { ...user.notificationPreferences, ...preferences }
    user.updatedAt = new Date().toISOString()

    res.json({
      preferences: user.notificationPreferences,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    console.error("Update notification preferences error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// Admin routes
app.get("/api/admin/stats", authenticateToken, requireAdmin, (req, res) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const stats = {
      overview: {
        totalUsers: database.users.length,
        activeUsers: database.users.filter((u) => new Date(u.lastLoginAt || u.createdAt) > thirtyDaysAgo).length,
        totalNovels: database.novels.length,
        totalChapters: database.chapters.length,
        totalViews: database.novels.reduce((sum, n) => sum + n.viewCount, 0),
        newUsersToday: database.users.filter((u) => new Date(u.createdAt) >= today).length,
        newNovelsToday: database.novels.filter((n) => new Date(n.createdAt) >= today).length,
      },
      userStats: {
        registrationsThisMonth: database.users.filter((u) => new Date(u.createdAt) > thirtyDaysAgo).length,
        activeReadersThisWeek: database.users.filter((u) => new Date(u.lastLoginAt || u.createdAt) > sevenDaysAgo)
          .length,
        premiumUsers: database.users.filter((u) => u.role === "premium").length,
        userRetentionRate: 0.78,
      },
      contentStats: {
        novelsPublishedThisMonth: database.novels.filter((n) => new Date(n.createdAt) > thirtyDaysAgo).length,
        chaptersPublishedToday: database.chapters.filter((c) => new Date(c.publishedAt) >= today).length,
        averageRating: database.novels.reduce((sum, n) => sum + n.rating, 0) / database.novels.length,
        topGenres: getTopGenres(),
      },
      engagementStats: {
        dailyActiveUsers: database.users.filter((u) => new Date(u.lastLoginAt || u.createdAt) >= today).length,
        averageSessionDuration: 1800,
        chaptersReadPerUser: database.readingProgress.length / database.users.length,
        bookmarkRate: database.bookmarks.length / database.users.length,
      },
    }

    res.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

app.get("/api/admin/analytics", authenticateToken, requireAdmin, (req, res) => {
  try {
    const { type = "users", period = "month", startDate, endDate } = req.query

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    const data = []
    let summary = {}
    let trends = {}

    if (type === "users") {
      // Generate user analytics data
      const days = Math.ceil((end - start) / (24 * 60 * 60 * 1000))
      for (let i = 0; i < days; i++) {
        const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
        data.push({
          date: date.toISOString().split("T")[0],
          newUsers: Math.floor(Math.random() * 50) + 10,
          activeUsers: Math.floor(Math.random() * 1000) + 2000,
          retentionRate: 0.7 + Math.random() * 0.2,
        })
      }

      summary = {
        totalNewUsers: data.reduce((sum, d) => sum + d.newUsers, 0),
        averageActiveUsers: Math.floor(data.reduce((sum, d) => sum + d.activeUsers, 0) / data.length),
        peakActiveUsers: Math.max(...data.map((d) => d.activeUsers)),
        averageRetentionRate: data.reduce((sum, d) => sum + d.retentionRate, 0) / data.length,
      }

      trends = {
        newUsersGrowth: 0.12,
        activeUsersGrowth: 0.08,
        retentionTrend: "stable",
      }
    }

    res.json({
      type,
      period,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      data,
      summary,
      trends,
    })
  } catch (error) {
    console.error("Admin analytics error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// File upload route
app.post("/api/upload", authenticateToken, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "No file uploaded",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`

    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("File upload error:", error)
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }
})

// Helper functions
function calculateRelevance(item, searchTerm) {
  let score = 0
  const term = searchTerm.toLowerCase()

  // Title match (highest weight)
  if (item.title && item.title.toLowerCase().includes(term)) {
    score += item.title.toLowerCase().indexOf(term) === 0 ? 10 : 5
  }

  // Author match
  if (item.author && item.author.toLowerCase().includes(term)) score += 3

  // Description/content match
  if (item.description && item.description.toLowerCase().includes(term)) {
    score += 2
  }
  if (item.content && item.content.toLowerCase().includes(term)) {
    score += 2
  }

  // Tags match
  if (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(term))) {
    score += 1
  }

  return score
}

function getMatchedTerms(item, searchTerm) {
  const terms = []
  const term = searchTerm.toLowerCase()

  if (item.title && item.title.toLowerCase().includes(term)) {
    terms.push("title")
  }
  if (item.author && item.author.toLowerCase().includes(term)) {
    terms.push("author")
  }
  if (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(term))) {
    terms.push("tags")
  }

  return terms
}

function getExcerpt(text, searchTerm) {
  const term = searchTerm.toLowerCase()
  const lowerText = text.toLowerCase()
  const index = lowerText.indexOf(term)

  if (index === -1) {
    return text.substring(0, 150) + "..."
  }

  const start = Math.max(0, index - 50)
  const end = Math.min(text.length, index + term.length + 50)

  return "..." + text.substring(start, end) + "..."
}

function generateSearchSuggestions(query) {
  const suggestions = [
    `${query} fantasy`,
    `${query} romance`,
    `${query} completed`,
    `${query} ongoing`,
    `${query} magic system`,
  ]

  return suggestions.slice(0, 3)
}

function getTopGenres() {
  const genreCounts = {}
  database.novels.forEach((novel) => {
    novel.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })

  return Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

// Serve uploaded files
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "uploads"))

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("authenticate", async (token) => {
    try {
      const decoded = verifyToken(token)
      socket.userId = decoded.userId
      socket.join(`user_${decoded.userId}`)

      // Send pending notifications
      const userNotifications = database.notifications.filter((n) => n.userId === decoded.userId && !n.isRead)

      if (userNotifications.length > 0) {
        socket.emit("notifications", userNotifications)
      }

      socket.emit("authenticated", { userId: decoded.userId })
    } catch (error) {
      socket.emit("auth_error", "Invalid token")
    }
  })

  socket.on("mark_notification_read", (notificationId) => {
    const notification = database.notifications.find((n) => n.id === notificationId)
    if (notification && notification.userId === socket.userId) {
      notification.isRead = true
      notification.readAt = new Date().toISOString()
      socket.emit("notification_marked_read", { id: notificationId })
    }
  })

  socket.on("join_novel", (novelId) => {
    socket.join(`novel_${novelId}`)
  })

  socket.on("leave_novel", (novelId) => {
    socket.leave(`novel_${novelId}`)
  })

  socket.on("reading_progress", (data) => {
    // Broadcast reading progress to other devices
    socket.to(`user_${socket.userId}`).emit("progress_sync", {
      type: "progress_sync",
      data: {
        novelId: data.novelId,
        chapterNumber: data.chapterNumber,
        position: data.position,
        device: "web",
        timestamp: new Date().toISOString(),
      },
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Broadcast new chapter notifications
function broadcastNewChapter(novelId, chapterData) {
  const novel = database.novels.find((n) => n.id === novelId)
  if (!novel) return

  // Find users who are following this novel (simplified)
  const followers = database.users.filter((u) => u.role === "user") // In real app, check follows table

  followers.forEach((user) => {
    const notification = {
      id: "notif_" + Date.now() + "_" + user.id,
      userId: user.id,
      type: "new_chapter",
      title: "New Chapter Available",
      message: `Chapter ${chapterData.number} of "${novel.title}" is now available!`,
      data: {
        novelId: novel.id,
        novelTitle: novel.title,
        chapterNumber: chapterData.number,
        chapterTitle: chapterData.title,
      },
      priority: "medium",
      isRead: false,
      createdAt: new Date().toISOString(),
      readAt: null,
      actions: [
        {
          type: "read_chapter",
          label: "Read Now",
          url: `/read/${novelId}/${chapterData.number}`,
        },
      ],
    }

    database.notifications.push(notification)

    // Send real-time notification
    io.to(`user_${user.id}`).emit("new_notification", notification)
  })
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "File size exceeds limit",
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      })
    }
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }

  if (error.message === "Only image files are allowed") {
    return res.status(415).json({
      error: {
        code: "UNSUPPORTED_MEDIA_TYPE",
        message: "Only image files are allowed",
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    })
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  })
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("HTTP server closed")
    redis.disconnect()
    process.exit(0)
  })
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`)
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = { app, server, io }
