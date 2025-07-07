"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, ChevronLeft, ChevronRight, Settings, Bookmark, Menu, Sun, Moon, Palette } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { updateProgress, toggleBookmark } from "@/app/actions/reading"

// Mock chapter data
const chapterData = {
  1: {
    title: "The Awakening",
    content: `The morning mist clung to the ancient stones of Ravenshollow like ghostly fingers, reluctant to release their hold on the world between night and day. Aria Nightwhisper stood at her bedroom window, watching the sun struggle to pierce through the ethereal veil that shrouded her family's ancestral home.

At seventeen, she had grown accustomed to the peculiar atmosphere that seemed to follow her wherever she went. The servants whispered when they thought she couldn't hear, speaking of strange lights that danced around her room at night and shadows that moved independently of their casters. Her grandmother, the formidable Lady Elara, had always dismissed such talk as superstitious nonsense, but Aria knew better.

She could feel it—a power that thrummed beneath her skin like a second heartbeat, growing stronger with each passing day. It called to her in dreams, showed her visions of places she had never been, and whispered secrets in a language she somehow understood despite never having learned it.

Today felt different. The air itself seemed charged with anticipation, as if the very fabric of reality was holding its breath. Aria pressed her palm against the cool glass of the window and gasped as frost began to spread from her touch, creating intricate patterns that resembled ancient runes.

"The time has come," a voice said behind her, causing Aria to spin around in surprise.

Lady Elara stood in the doorway, her silver hair gleaming in the dim light. But there was something different about her grandmother today—her usually stern expression had been replaced by one of profound sadness mixed with what looked almost like... pride?

"Grandmother? What do you mean?" Aria asked, though part of her already knew the answer.

"Your eighteenth birthday approaches, child. And with it, the awakening of your true heritage." Lady Elara stepped into the room, her long robes rustling against the stone floor. "It is time you learned the truth about who you really are, and why the shadows have always been drawn to you."

Aria's heart began to race. All her life, she had felt like an outsider, even within her own family. The strange occurrences, the whispered conversations that stopped when she entered a room, the way certain objects seemed to respond to her emotions—it all suddenly made sense.

"I'm not entirely human, am I?" she whispered.

Lady Elara's smile was both sad and proud. "No, my dear. You are so much more than that. You are the last heir to the Midnight Throne, the final hope of a realm that has been lost to darkness for over a century."

The words hit Aria like a physical blow. She sank onto her bed, her mind reeling with the implications. "The Midnight Throne? But that's just a legend, a story from the old books..."

"The stories are real, Aria. Every single one of them." Lady Elara moved to sit beside her granddaughter, her weathered hand gently taking Aria's trembling one. "Your mother was the Crown Princess of the Shadow Realm, and your father... your father was the Guardian of the Veil, the bridge between our world and theirs."

Tears began to flow down Aria's cheeks as the truth she had always suspected finally came to light. "They're dead, aren't they? That's why I've always felt so alone."

"They died protecting both realms from an ancient evil that sought to merge the worlds and rule over the resulting chaos. But before they fell, they managed to hide you here, in the mortal realm, where you could grow strong enough to one day reclaim your birthright."

Aria looked down at her hands, watching as shadows began to dance between her fingers without her conscious control. "I don't know if I'm strong enough for this, Grandmother. I can barely control what's happening to me now."

"Strength isn't about control, child. It's about acceptance. Accept who you are, embrace your power, and trust in the bonds you will forge along the way." Lady Elara stood and walked to an ancient chest that had always sat in the corner of Aria's room, locked and mysterious. "Your training begins now."

As the chest opened with a sound like distant thunder, a soft, otherworldly light spilled out, and Aria knew that her ordinary life was about to end forever. The awakening had begun, and with it, a journey that would determine the fate of two worlds.

The shadows whispered her name, and for the first time in her life, Aria whispered back.`,
  },
}

export default function ReadingPage() {
  const params = useParams()
  const novelId = params.id as string
  const chapterNumber = Number.parseInt(params.chapter as string)

  const [fontSize, setFontSize] = useState([16])
  const [fontFamily, setFontFamily] = useState("serif")
  const [theme, setTheme] = useState("light")
  const [showSettings, setShowSettings] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
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

    loadUserData()
  }, [novelId, chapterNumber])

  // Update reading progress when chapter changes
  useEffect(() => {
    if (user) {
      updateProgress(novelId, chapterNumber, 0) // Start of chapter
    }
  }, [user, novelId, chapterNumber])

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

  const chapter = chapterData[chapterNumber as keyof typeof chapterData]

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <p key={index} className="mb-6">
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

          <div className="text-sm text-muted-foreground">Chapter {chapterNumber} of 45</div>

          <Link href={`/read/${novelId}/${chapterNumber + 1}`}>
            <Button>
              Next Chapter
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
