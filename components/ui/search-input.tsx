"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchInputProps {
  placeholder?: string
  paramName?: string
  className?: string
}

export function SearchInput({ placeholder = "Search...", paramName = "search", className = "" }: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get(paramName) || "")

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(searchParams.get(paramName) || "")
  }, [searchParams, paramName])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    // Reset to page 1 when searching
    params.set("page", "1")

    if (searchTerm) {
      params.set(paramName, searchTerm)
    } else {
      params.delete(paramName)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchTerm("")

    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramName)
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-16"
      />
      {searchTerm && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-8 top-0 h-10 w-10"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}

