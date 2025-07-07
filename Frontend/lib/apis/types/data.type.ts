export interface NovelInfo {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: string[];
  tags: string[];
  status: "ongoing" | "completed" | string; // có thể thêm enum cụ thể
  rating: {
    count: number;
    average: number;
  };
  views: number;
  favorites: number;
  chapters: number;
  wordCount: number;
  updatedAt: string;  // ISO date string
  createdAt: string;  // ISO date string
  isCompleted: boolean;
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
    number: number;
    title: string;
    content: string;
    wordCount: number;
    publishedAt: string; 
    isLocked?: boolean;
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
  isCompleted: boolean;
  chapters: ChapterInfo[];
  author: Author;
}
