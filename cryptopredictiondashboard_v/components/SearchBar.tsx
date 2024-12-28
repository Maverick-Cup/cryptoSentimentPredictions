'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    onSearch(searchQuery)
  }, [searchQuery, onSearch])

  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        placeholder="Search any cryptocurrency..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        </div>
      )}
    </div>
  )
}

