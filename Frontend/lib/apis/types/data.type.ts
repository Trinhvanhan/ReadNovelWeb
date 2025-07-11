export interface NovelInfo {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: { name: string }[];
  tags: string[];
  status: "ongoing" | "completed" | string; // có thể thêm enum cụ thể
  rating: {
    count: number;
    average: number;
  };
  views: number;
  favorites: number;
  chapters: number;
  features: number;
  followers: number;
  wordCount: number;
  updatedAt: string;  // ISO date string
  createdAt: string;  // ISO date string
}

export interface Bookmark {
  id: string;
  novelId: string;
  userId: string;
  chapterNumber: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ChapterInfo {
  number: number;
  title: string;
  wordCount: number;
  publishedAt: string;  // ISO date string
}

export interface Chapter {
    navigation: any;
    number: number;
    title: string;
    content: string;
    publishedAt: string; 
}

export interface Genre {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  novelCount: number;
  followerCount: number;
}

export interface Rating {
  count: number;
  average: number;
}

export interface Genre {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface Novel {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  genres: Genre[];
  tags: string[];
  status: "ongoing" | "completed" | string;
  language: string;
  rating: Rating;
  views: number;
  favorites: number;
  features: number;
  followers: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  chapters: ChapterInfo[];
  author: Author;
  userInteraction: {
    isFollowing: boolean;
    isFavorited: boolean;
    isFeatured: boolean;
    rating?: number;
    lastReadChapter?: number;
    readingProgress?: number
  }
}

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

export interface UserPreferences {
  theme: string;
  fontSize: string;
  autoBookmark: boolean;
  notifications: NotificationPreferences;
}

export interface User {
  id: string; // optional if not saved yet
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  genres: { name: string}[];
  tags: string[];
  status: "ongoing" | "completed" | string;
  language: string;
  rating: Rating;
  views: number;
  favorites: number;
  features: number;
  followers: number;
  chapters: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  relevanceScore: number;
}

export interface ToggleInteractionBody {
  targetId: string;
  targetType: string;
  type: 'follow' | 'favorite' | 'feature' | 'view';
}