"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { SearchSuggestions } from "./search-suggestions"

interface SearchBarProps {
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SearchBar({ placeholder = "Search novels...", className = "", size = "md" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10",
    lg: "h-12 text-lg",
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(query.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`pl-10 pr-12 ${sizeClasses[size]}`}
        />
        <Button
          size="sm"
          onClick={() => handleSearch()}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3"
        >
          Search
        </Button>
      </div>

      {showSuggestions && (
        <SearchSuggestions
          query={query}
          onSelect={(suggestion) => {
            setQuery(suggestion)
            handleSearch(suggestion)
          }}
        />
      )}
    </div>
  )
}
