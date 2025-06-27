"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, Tag, Hash } from "lucide-react"
import { getSearchSuggestions } from "@/lib/search"
import type { SearchSuggestion } from "@/lib/search"

interface SearchSuggestionsProps {
  query: string
  onSelect: (suggestion: string) => void
}

export function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    getSearchSuggestions(query)
      .then(setSuggestions)
      .finally(() => setIsLoading(false))
  }, [query])

  if (isLoading || suggestions.length === 0) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "novel":
        return <BookOpen className="h-4 w-4" />
      case "author":
        return <User className="h-4 w-4" />
      case "genre":
        return <Tag className="h-4 w-4" />
      case "tag":
        return <Hash className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "novel":
        return "text-blue-600"
      case "author":
        return "text-green-600"
      case "genre":
        return "text-purple-600"
      case "tag":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
      <CardContent className="p-0">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.type}-${suggestion.text}`}
            className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
            onClick={() => onSelect(suggestion.text)}
          >
            <div className="flex items-center space-x-3">
              <div className={getTypeColor(suggestion.type)}>{getIcon(suggestion.type)}</div>
              <div>
                <span className="font-medium">{suggestion.text}</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {suggestion.type}
                  </Badge>
                  {suggestion.count && (
                    <span className="text-xs text-muted-foreground">
                      {suggestion.count} novel{suggestion.count !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
