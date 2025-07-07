# Novel Reader API Documentation

## Overview

The Novel Reader API provides a comprehensive backend service for managing novels, user authentication, reading progress, search functionality, and notifications. This RESTful API supports the frontend application with efficient data management and real-time features.

**Base URL:** `https://your-domain.com/api`
**Version:** v1
**Content-Type:** `application/json`

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Novel Management](#novel-management)
4. [Reading Progress](#reading-progress)
5. [Search](#search)
6. [Notifications](#notifications)
7. [Admin Endpoints](#admin-endpoints)
8. [File Upload](#file-upload)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)
11. [WebSocket Events](#websocket-events)

---

## Authentication

### Overview
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header for protected endpoints.

**Header Format:** `Authorization: Bearer <token>`

### POST /auth/login
Authenticate a user and receive an access token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "preferences": {
      "theme": "dark",
      "fontSize": "medium",
      "notifications": {
        "email": true,
        "push": false,
        "newChapters": true,
        "recommendations": false
      }
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1704067200000
}
\`\`\`

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### POST /auth/signup
Register a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": null,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "preferences": {
      "theme": "light",
      "fontSize": "medium",
      "notifications": {
        "email": true,
        "push": false,
        "newChapters": true,
        "recommendations": true
      }
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1704067200000
}
\`\`\`

**Error Responses:**
- `409 Conflict`: User already exists
- `400 Bad Request`: Invalid input data

### POST /auth/logout
Invalidate the current session token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
\`\`\`json
{
  "message": "Successfully logged out"
}
\`\`\`

### POST /auth/refresh
Refresh an expired access token.

**Headers:** `Authorization: Bearer <refresh_token>`

**Response (200):**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1704067200000
}
\`\`\`

---

## User Management

### GET /auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
\`\`\`json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLoginAt": "2024-01-15T10:30:00Z",
  "preferences": {
    "theme": "dark",
    "fontSize": "large",
    "autoBookmark": true,
    "notifications": {
      "email": true,
      "push": false,
      "newChapters": true,
      "recommendations": false
    }
  },
  "stats": {
    "novelsRead": 25,
    "chaptersRead": 1250,
    "totalReadingTime": 75600,
    "favoriteGenres": ["fantasy", "sci-fi", "romance"]
  }
}
\`\`\`

### PATCH /user/profile
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "avatar": "https://example.com/new-avatar.jpg"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "user_123",
  "name": "Jane Doe",
  "email": "user@example.com",
  "avatar": "https://example.com/new-avatar.jpg",
  "updatedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

### PATCH /user/preferences
Update user preferences.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "theme": "dark",
  "fontSize": "large",
  "autoBookmark": true,
  "notifications": {
    "email": false,
    "push": true,
    "newChapters": true,
    "recommendations": false
  }
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "preferences": {
    "theme": "dark",
    "fontSize": "large",
    "autoBookmark": true,
    "notifications": {
      "email": false,
      "push": true,
      "newChapters": true,
      "recommendations": false
    }
  },
  "updatedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

---

## Novel Management

### GET /novels
Get a paginated list of novels with optional filtering.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 20, max: 100): Items per page
- `genre` (string): Filter by genre
- `status` (string): Filter by status (ongoing, completed, hiatus)
- `language` (string): Filter by language
- `sortBy` (string): Sort by (title, rating, popularity, updated, created)
- `sortOrder` (string): Sort order (asc, desc)

**Example Request:**
\`\`\`
GET /novels?page=1&limit=20&genre=fantasy&status=ongoing&sortBy=popularity&sortOrder=desc
\`\`\`

**Response (200):**
\`\`\`json
{
  "novels": [
    {
      "id": "novel_123",
      "title": "The Chronicles of Aetheria",
      "author": "Jane Smith",
      "description": "An epic fantasy adventure in a magical realm...",
      "coverImage": "https://example.com/covers/novel_123.jpg",
      "genres": ["fantasy", "adventure", "magic"],
      "tags": ["dragons", "magic system", "coming of age"],
      "status": "ongoing",
      "language": "en",
      "rating": 4.7,
      "ratingCount": 1250,
      "viewCount": 50000,
      "favoriteCount": 3200,
      "chapterCount": 45,
      "wordCount": 180000,
      "lastUpdated": "2024-01-15T08:00:00Z",
      "createdAt": "2023-06-01T00:00:00Z",
      "isCompleted": false,
      "isPremium": false
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 25,
    "totalCount": 500,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "availableGenres": ["fantasy", "romance", "sci-fi", "mystery"],
    "availableLanguages": ["en", "es", "fr", "de"],
    "availableStatuses": ["ongoing", "completed", "hiatus"]
  }
}
\`\`\`

### GET /novels/:id
Get detailed information about a specific novel.

**Path Parameters:**
- `id` (string): Novel ID

**Response (200):**
\`\`\`json
{
  "id": "novel_123",
  "title": "The Chronicles of Aetheria",
  "author": "Jane Smith",
  "description": "An epic fantasy adventure in a magical realm where young Aria discovers her magical abilities and embarks on a quest to save her kingdom from an ancient evil.",
  "coverImage": "https://example.com/covers/novel_123.jpg",
  "genres": ["fantasy", "adventure", "magic"],
  "tags": ["dragons", "magic system", "coming of age", "female protagonist"],
  "status": "ongoing",
  "language": "en",
  "rating": 4.7,
  "ratingCount": 1250,
  "viewCount": 50000,
  "favoriteCount": 3200,
  "chapterCount": 45,
  "wordCount": 180000,
  "lastUpdated": "2024-01-15T08:00:00Z",
  "createdAt": "2023-06-01T00:00:00Z",
  "isCompleted": false,
  "isPremium": false,
  "chapters": [
    {
      "number": 1,
      "title": "The Awakening",
      "wordCount": 4200,
      "publishedAt": "2023-06-01T00:00:00Z",
      "isLocked": false
    },
    {
      "number": 2,
      "title": "First Steps",
      "wordCount": 3800,
      "publishedAt": "2023-06-03T00:00:00Z",
      "isLocked": false
    }
  ],
  "author": {
    "id": "author_456",
    "name": "Jane Smith",
    "avatar": "https://example.com/authors/jane_smith.jpg",
    "bio": "Fantasy author with 10+ years of experience...",
    "novelCount": 3,
    "followerCount": 15000
  },
  "userInteraction": {
    "isFavorited": true,
    "isFollowing": true,
    "rating": 5,
    "lastReadChapter": 12,
    "readingProgress": 0.27
  }
}
\`\`\`

### GET /novels/:id/chapters/:chapter
Get a specific chapter content.

**Path Parameters:**
- `id` (string): Novel ID
- `chapter` (number): Chapter number

**Headers:** `Authorization: Bearer <token>` (required for premium content)

**Response (200):**
\`\`\`json
{
  "id": "chapter_789",
  "novelId": "novel_123",
  "number": 1,
  "title": "The Awakening",
  "content": "The morning sun cast long shadows across the village square as Aria stepped out of her cottage...",
  "wordCount": 4200,
  "publishedAt": "2023-06-01T00:00:00Z",
  "updatedAt": "2023-06-01T00:00:00Z",
  "isLocked": false,
  "navigation": {
    "previousChapter": null,
    "nextChapter": {
      "number": 2,
      "title": "First Steps",
      "isLocked": false
    }
  },
  "novel": {
    "id": "novel_123",
    "title": "The Chronicles of Aetheria",
    "author": "Jane Smith",
    "coverImage": "https://example.com/covers/novel_123.jpg"
  }
}
\`\`\`

---

## Reading Progress

### GET /reading/progress
Get user's reading progress for all novels.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
\`\`\`json
{
  "progress": [
    {
      "novelId": "novel_123",
      "novel": {
        "id": "novel_123",
        "title": "The Chronicles of Aetheria",
        "author": "Jane Smith",
        "coverImage": "https://example.com/covers/novel_123.jpg",
        "chapterCount": 45
      },
      "currentChapter": 12,
      "currentPosition": 0.65,
      "lastReadAt": "2024-01-15T10:30:00Z",
      "totalReadingTime": 7200,
      "progressPercentage": 0.27,
      "isCompleted": false
    }
  ],
  "stats": {
    "totalNovels": 15,
    "completedNovels": 3,
    "totalChapters": 450,
    "totalReadingTime": 108000,
    "averageReadingSpeed": 250
  }
}
\`\`\`

### POST /reading/progress
Update reading progress for a specific novel.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "novelId": "novel_123",
  "chapterNumber": 12,
  "position": 0.65,
  "readingTime": 1200
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "novelId": "novel_123",
  "chapterNumber": 12,
  "position": 0.65,
  "lastReadAt": "2024-01-15T10:30:00Z",
  "totalReadingTime": 8400,
  "progressPercentage": 0.27,
  "milestone": {
    "type": "chapter_milestone",
    "message": "You've read 10 chapters! Keep going!",
    "reward": "achievement_badge"
  }
}
\`\`\`

### GET /reading/bookmarks
Get user's bookmarks.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page
- `novelId` (string): Filter by novel ID

**Response (200):**
\`\`\`json
{
  "bookmarks": [
    {
      "id": "bookmark_456",
      "novelId": "novel_123",
      "chapterNumber": 8,
      "position": 0.45,
      "note": "Important plot twist here!",
      "createdAt": "2024-01-10T15:20:00Z",
      "novel": {
        "id": "novel_123",
        "title": "The Chronicles of Aetheria",
        "author": "Jane Smith",
        "coverImage": "https://example.com/covers/novel_123.jpg"
      },
      "chapter": {
        "number": 8,
        "title": "The Revelation",
        "excerpt": "...the truth about her heritage was finally revealed..."
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
\`\`\`

### POST /reading/bookmarks
Add or toggle a bookmark.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "novelId": "novel_123",
  "chapterNumber": 8,
  "position": 0.45,
  "note": "Important plot twist here!"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "bookmark_456",
  "novelId": "novel_123",
  "chapterNumber": 8,
  "position": 0.45,
  "note": "Important plot twist here!",
  "createdAt": "2024-01-15T10:30:00Z",
  "isBookmarked": true
}
\`\`\`

---

## Search

### GET /search
Search for novels with advanced filtering and sorting.

**Query Parameters:**
- `q` (string): Search query
- `genres` (string): Comma-separated genre filters
- `status` (string): Comma-separated status filters
- `rating` (string): Rating range (e.g., "4,5" for 4-5 stars)
- `wordCount` (string): Word count ranges
- `language` (string): Comma-separated language codes
- `tags` (string): Comma-separated tags
- `sortBy` (string): Sort field (relevance, rating, popularity, newest, updated)
- `sortOrder` (string): Sort order (asc, desc)
- `page` (number): Page number
- `limit` (number): Items per page

**Example Request:**
\`\`\`
GET /search?q=fantasy+magic&genres=fantasy,adventure&status=ongoing&rating=4,5&sortBy=popularity&sortOrder=desc&page=1&limit=20
\`\`\`

**Response (200):**
\`\`\`json
{
  "results": [
    {
      "id": "novel_123",
      "title": "The Chronicles of Aetheria",
      "author": "Jane Smith",
      "description": "An epic fantasy adventure...",
      "coverImage": "https://example.com/covers/novel_123.jpg",
      "genres": ["fantasy", "adventure", "magic"],
      "rating": 4.7,
      "ratingCount": 1250,
      "chapterCount": 45,
      "status": "ongoing",
      "relevanceScore": 0.95,
      "matchedTerms": ["fantasy", "magic"],
      "excerpt": "...magical realm where young Aria discovers her abilities..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 15,
    "totalCount": 300,
    "hasNext": true,
    "hasPrev": false
  },
  "searchInfo": {
    "query": "fantasy magic",
    "executionTime": 0.045,
    "appliedFilters": {
      "genres": ["fantasy", "adventure"],
      "status": ["ongoing"],
      "rating": [4, 5]
    },
    "suggestions": [
      "fantasy magic system",
      "fantasy magic academy",
      "fantasy magic world"
    ]
  },
  "facets": {
    "genres": [
      { "name": "fantasy", "count": 150 },
      { "name": "adventure", "count": 120 },
      { "name": "magic", "count": 100 }
    ],
    "status": [
      { "name": "ongoing", "count": 200 },
      { "name": "completed", "count": 80 },
      { "name": "hiatus", "count": 20 }
    ]
  }
}
\`\`\`

### GET /search/suggestions
Get search suggestions based on partial query.

**Query Parameters:**
- `q` (string): Partial search query

**Response (200):**
\`\`\`json
{
  "suggestions": [
    {
      "text": "fantasy magic system",
      "type": "query",
      "popularity": 850
    },
    {
      "text": "The Chronicles of Aetheria",
      "type": "novel",
      "id": "novel_123",
      "author": "Jane Smith",
      "coverImage": "https://example.com/covers/novel_123.jpg"
    },
    {
      "text": "Jane Smith",
      "type": "author",
      "id": "author_456",
      "novelCount": 3
    }
  ]
}
\`\`\`

---

## Notifications

### GET /notifications
Get user notifications with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page
- `type` (string): Filter by notification type
- `read` (boolean): Filter by read status
- `priority` (string): Filter by priority (low, medium, high)

**Response (200):**
\`\`\`json
{
  "notifications": [
    {
      "id": "notif_789",
      "type": "new_chapter",
      "title": "New Chapter Available",
      "message": "Chapter 46 of 'The Chronicles of Aetheria' is now available!",
      "data": {
        "novelId": "novel_123",
        "novelTitle": "The Chronicles of Aetheria",
        "chapterNumber": 46,
        "chapterTitle": "The Final Battle"
      },
      "priority": "medium",
      "isRead": false,
      "createdAt": "2024-01-15T08:00:00Z",
      "readAt": null,
      "actions": [
        {
          "type": "read_chapter",
          "label": "Read Now",
          "url": "/read/novel_123/46"
        },
        {
          "type": "mark_read",
          "label": "Mark as Read"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 95,
    "hasNext": true,
    "hasPrev": false
  },
  "summary": {
    "unreadCount": 12,
    "totalCount": 95,
    "typeBreakdown": {
      "new_chapter": 8,
      "recommendation": 3,
      "system": 1
    }
  }
}
\`\`\`

### POST /notifications/read
Mark notifications as read.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "ids": ["notif_789", "notif_790", "notif_791"]
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "markedAsRead": 3,
  "updatedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

### PATCH /notifications/preferences
Update notification preferences.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "email": {
    "enabled": true,
    "newChapters": true,
    "recommendations": false,
    "systemUpdates": true,
    "frequency": "immediate"
  },
  "push": {
    "enabled": false,
    "newChapters": false,
    "recommendations": false,
    "systemUpdates": true
  },
  "inApp": {
    "enabled": true,
    "newChapters": true,
    "recommendations": true,
    "systemUpdates": true
  }
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "preferences": {
    "email": {
      "enabled": true,
      "newChapters": true,
      "recommendations": false,
      "systemUpdates": true,
      "frequency": "immediate"
    },
    "push": {
      "enabled": false,
      "newChapters": false,
      "recommendations": false,
      "systemUpdates": true
    },
    "inApp": {
      "enabled": true,
      "newChapters": true,
      "recommendations": true,
      "systemUpdates": true
    }
  },
  "updatedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

---

## Admin Endpoints

### GET /admin/stats
Get admin dashboard statistics.

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
\`\`\`json
{
  "overview": {
    "totalUsers": 15420,
    "activeUsers": 8750,
    "totalNovels": 2340,
    "totalChapters": 45680,
    "totalViews": 2500000,
    "newUsersToday": 45,
    "newNovelsToday": 12
  },
  "userStats": {
    "registrationsThisMonth": 1250,
    "activeReadersThisWeek": 6800,
    "premiumUsers": 890,
    "userRetentionRate": 0.78
  },
  "contentStats": {
    "novelsPublishedThisMonth": 180,
    "chaptersPublishedToday": 95,
    "averageRating": 4.2,
    "topGenres": [
      { "genre": "fantasy", "count": 450 },
      { "genre": "romance", "count": 380 },
      { "genre": "sci-fi", "count": 320 }
    ]
  },
  "engagementStats": {
    "dailyActiveUsers": 3200,
    "averageSessionDuration": 1800,
    "chaptersReadPerUser": 12.5,
    "bookmarkRate": 0.15
  }
}
\`\`\`

### GET /admin/analytics
Get detailed analytics data.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `type` (string): Analytics type (users, content, engagement, revenue)
- `period` (string): Time period (day, week, month, year)
- `startDate` (string): Start date (ISO format)
- `endDate` (string): End date (ISO format)

**Response (200):**
\`\`\`json
{
  "type": "users",
  "period": "month",
  "dateRange": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "data": [
    {
      "date": "2024-01-01",
      "newUsers": 45,
      "activeUsers": 3200,
      "retentionRate": 0.78
    }
  ],
  "summary": {
    "totalNewUsers": 1250,
    "averageActiveUsers": 3150,
    "peakActiveUsers": 4200,
    "averageRetentionRate": 0.76
  },
  "trends": {
    "newUsersGrowth": 0.12,
    "activeUsersGrowth": 0.08,
    "retentionTrend": "stable"
  }
}
\`\`\`

---

## File Upload

### POST /upload
Upload files (covers, avatars, documents).

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file` (File): The file to upload
- `type` (string): File type (cover, avatar, document)
- `novelId` (string, optional): Novel ID for cover images

**Response (200):**
\`\`\`json
{
  "url": "https://cdn.example.com/uploads/covers/novel_123_cover.jpg",
  "filename": "novel_123_cover.jpg",
  "size": 245760,
  "mimeType": "image/jpeg",
  "uploadedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

**Error Responses:**
- `400 Bad Request`: Invalid file type or size
- `413 Payload Too Large`: File size exceeds limit
- `415 Unsupported Media Type`: Invalid file format

---

## Error Handling

### Standard Error Response Format

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456789"
  }
}
\`\`\`

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## Rate Limiting

### Limits by Endpoint Type

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Search | 100 requests | 1 hour |
| Reading Progress | 200 requests | 1 hour |
| General API | 1000 requests | 1 hour |
| File Upload | 10 requests | 1 hour |

### Rate Limit Headers

\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704067200
X-RateLimit-Window: 3600
\`\`\`

---

## WebSocket Events

### Connection
Connect to WebSocket for real-time updates:
\`\`\`
wss://your-domain.com/ws?token=<jwt_token>
\`\`\`

### Event Types

#### New Chapter Notification
\`\`\`json
{
  "type": "new_chapter",
  "data": {
    "novelId": "novel_123",
    "novelTitle": "The Chronicles of Aetheria",
    "chapterNumber": 46,
    "chapterTitle": "The Final Battle",
    "publishedAt": "2024-01-15T08:00:00Z"
  }
}
\`\`\`

#### Reading Progress Sync
\`\`\`json
{
  "type": "progress_sync",
  "data": {
    "novelId": "novel_123",
    "chapterNumber": 12,
    "position": 0.65,
    "device": "mobile",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

#### System Notification
\`\`\`json
{
  "type": "system_notification",
  "data": {
    "id": "notif_123",
    "title": "System Maintenance",
    "message": "Scheduled maintenance in 30 minutes",
    "priority": "high",
    "actions": [
      {
        "type": "dismiss",
        "label": "Dismiss"
      }
    ]
  }
}
\`\`\`

---

## SDK Integration Examples

### JavaScript/TypeScript (RTK Query)

\`\`\`typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  reducerPath: 'novelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getNovels: builder.query<NovelResponse, NovelFilters>({
      query: (filters) => ({
        url: '/novels',
        params: filters,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useGetNovelsQuery, useLoginMutation } = api
\`\`\`

### React Hook Usage

\`\`\`typescript
function NovelList() {
  const { data, error, isLoading } = useGetNovelsQuery({
    page: 1,
    limit: 20,
    genre: 'fantasy'
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.novels.map(novel => (
        <NovelCard key={novel.id} novel={novel} />
      ))}
    </div>
  )
}
\`\`\`

### WebSocket Integration

\`\`\`typescript
class NovelWebSocket {
  private ws: WebSocket | null = null
  
  connect(token: string) {
    this.ws = new WebSocket(`wss://api.example.com/ws?token=${token}`)
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      this.handleMessage(message)
    }
  }
  
  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'new_chapter':
        // Handle new chapter notification
        break
      case 'progress_sync':
        // Sync reading progress across devices
        break
    }
  }
}
\`\`\`

---

## Changelog

### v1.2.0 (2024-01-15)
- Added advanced search with faceted filtering
- Implemented WebSocket real-time notifications
- Added reading analytics and milestones
- Enhanced error handling and validation

### v1.1.0 (2024-01-01)
- Added bookmark functionality
- Implemented notification preferences
- Added file upload endpoints
- Enhanced admin analytics

### v1.0.0 (2023-12-01)
- Initial API release
- Basic authentication and user management
- Novel and chapter management
- Reading progress tracking
- Basic search functionality

---

## Support

For API support and questions:
- **Documentation:** https://docs.example.com/api
- **Support Email:** api-support@example.com
- **Status Page:** https://status.example.com
- **GitHub Issues:** https://github.com/example/novel-reader-api/issues
