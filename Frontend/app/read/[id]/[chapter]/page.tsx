"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, ChevronLeft, ChevronRight, Settings, Bookmark, Heart, Star, Menu, Sun, Moon, Palette } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { updateProgress, toggleBookmark } from "@/app/actions/reading"
import { getNovelChapterByNumber } from "@/lib/apis/chapter.api"
import type { Chapter } from "@/lib/apis/types/data.type"


export default function ReadingPage() {
  const router = useRouter()
  const params = useParams()
  const novelId = params.id as string
  const chapterNumber = Number.parseInt(params.chapter as string)


  const [fontSize, setFontSize] = useState([16])
  const [fontFamily, setFontFamily] = useState("serif")
  const [theme, setTheme] = useState("light")
  const [showSettings, setShowSettings] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Load user and bookmark status
    async function loadUserData() {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)

          // Check if chapter is bookmarked
          const progressResponse = await fetch(`/api/reading/progress/${novelId}`)
          if (progressResponse.ok) {
            const progress = await progressResponse.json()
            setIsBookmarked(progress.bookmarkedChapters?.includes(chapterNumber) || false)
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
      }
    }

    // loadUserData()
  }, [novelId, chapterNumber])

  // Update reading progress when chapter changes
  useEffect(() => {
    if (user) {
      // updateProgress(novelId, chapterNumber, 0) // Start of chapter
    }
  }, [user, novelId, chapterNumber])

  useEffect(() => {
    async function fetchChapter() {
      try {
        const result = await getNovelChapterByNumber(novelId, chapterNumber)
        if (result.status === 200) {
          console.log(result)
          setChapter(result.data)
        } else {
          setChapter(null)
        }
      } catch (error) {
        console.error("Failed to load chapter:", error)
        setChapter(null)
      }
    }

    fetchChapter()
    }, [novelId, chapterNumber])

    useEffect(() => {
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey && e.key === 'c') || (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
        }
      };
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

  // Add bookmark toggle function:
  const handleBookmarkToggle = async () => {
    if (!user) return

    try {
      await toggleBookmark(novelId, chapterNumber, isBookmarked)
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Failed to toggle bookmark:", error)
    }
  }

  const fontFamilies = {
    serif: "font-serif",
    sans: "font-sans",
    mono: "font-mono",
  }

  const themes = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-gray-100",
    sepia: "bg-amber-50 text-amber-900",
  }

  if (!chapter) {
    return <div>Chapter not found</div>
  }

  return (
    <div className={`min-h-screen transition-colors ${themes[theme as keyof typeof themes]}`}>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold">NovelReader</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Chapter {chapterNumber}</span>
              <span>•</span>
              <span>{chapter.title}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleBookmarkToggle}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="fixed top-16 right-4 z-50 w-80">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">Reading Settings</h3>

            <div>
              <label className="text-sm font-medium mb-2 block">Font Size</label>
              <Slider value={fontSize} onValueChange={setFontSize} max={24} min={12} step={1} className="w-full" />
              <div className="text-xs text-muted-foreground mt-1">{fontSize[0]}px</div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Font Family</label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="sans">Sans Serif</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="flex space-x-2">
                <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4" />
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4" />
                </Button>
                <Button variant={theme === "sepia" ? "default" : "outline"} size="sm" onClick={() => setTheme("sepia")}>
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


      {
        chapter ? (<div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Chapter {chapterNumber}: {chapter.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href={`/novel/${novelId}`} className="hover:text-foreground">
              ← Back to Novel
            </Link>
          </div>
        </div>

        <div
          className={`prose prose-lg max-w-none leading-relaxed ${fontFamilies[fontFamily as keyof typeof fontFamilies]}`}
          style={{ fontSize: `${fontSize[0]}px` }}
        >
          {chapter.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-6 text-justify select-none">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
          <Button variant="outline" disabled={chapterNumber <= 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Chapter
          </Button>
          <Select value={chapterNumber.toString()} onValueChange={(value) =>
            router.push(`/read/${novelId}/${Number(value)}`)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: chapter.navigation.totalChapters }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  Chapter {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Link href={`/read/${novelId}/${chapterNumber + 1}`}>
            <Button>
              Next Chapter
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>) : (<>Chapter not found</>)
      }
      {/* Main Content */}
      
    </div>
  )
}
