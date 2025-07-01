'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from './LanguageProvider'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResult {
  id: string
  slug: string
  title: string
  summary: string
  thumbnail_url?: string
  published_at: string
  category_name?: string
  match_type: 'title' | 'content' | 'tag'
}

interface SearchBarProps {
  onSearch?: (query: string) => void
  className?: string
  hideIcon?: boolean
  compact?: boolean
}

const DEBOUNCE_DELAY = 300

export default function SearchBar({ onSearch, className = '', hideIcon = false, compact = false }: SearchBarProps) {
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState('')

  // Memoize search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Search in blog post translations (title and content)
      const { data: translationResults, error: translationError } = await supabase
        .from('blog_post_translations')
        .select(`
          blog_post_id,
          title,
          summary,
          content,
          language_code,
          blog_posts!inner(
            id,
            slug,
            status,
            published_at,
            thumbnail_url,
            categories(
              category_translations(name, language_code)
            )
          )
        `)
        .eq('language_code', language)
        .eq('blog_posts.status', 'published')
        .or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(10)

      if (translationError) {
        console.error('Search error:', translationError)
        setError('Search failed')
        return
      }

      // Search in tags
      const { data: tagResults, error: tagError } = await supabase
        .from('tag_translations')
        .select(`
          name,
          language_code,
          tags!inner(
            id,
            slug,
            blog_post_tags(
              blog_post_id,
              blog_posts!inner(
                id,
                slug,
                status,
                published_at,
                thumbnail_url,
                blog_post_translations!inner(
                  title,
                  summary,
                  language_code
                ),
                categories(
                  category_translations(name, language_code)
                )
              )
            )
          )
        `)
        .eq('language_code', language)
        .ilike('name', `%${searchQuery}%`)
        .limit(5)

      if (tagError) {
        console.error('Tag search error:', tagError)
      }

      // Process translation results
      const processedResults: SearchResult[] = []
      const seenIds = new Set<string>()

      // Add translation matches
      translationResults?.forEach((result: any) => {
        if (!seenIds.has(result.blog_post_id)) {
          seenIds.add(result.blog_post_id)
          processedResults.push({
            id: result.blog_post_id,
            slug: result.blog_posts.slug,
            title: result.title,
            summary: result.summary,
            thumbnail_url: result.blog_posts.thumbnail_url,
            published_at: result.blog_posts.published_at,
            category_name: result.blog_posts.categories?.category_translations?.find(
              (t: any) => t.language_code === language
            )?.name,
            match_type: result.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 'title' : 'content'
          })
        }
      })

      // Add tag matches
      tagResults?.forEach((tagResult: any) => {
        tagResult.tags.blog_post_tags?.forEach((tagLink: any) => {
          const post = tagLink.blog_posts
          if (post && !seenIds.has(post.id)) {
            seenIds.add(post.id)
            const translation = post.blog_post_translations?.find((t: any) => t.language_code === language)
            if (translation) {
              processedResults.push({
                id: post.id,
                slug: post.slug,
                title: translation.title,
                summary: translation.summary,
                thumbnail_url: post.thumbnail_url,
                published_at: post.published_at,
                category_name: post.categories?.category_translations?.find(
                  (t: any) => t.language_code === language
                )?.name,
                match_type: 'tag'
              })
            }
          }
        })
      })

      // Sort results: title matches first, then content, then tags
      processedResults.sort((a, b) => {
        const typeOrder = { title: 0, content: 1, tag: 2 }
        return typeOrder[a.match_type] - typeOrder[b.match_type]
      })

      setResults(processedResults.slice(0, 10))
    } catch (err) {
      console.error('Search error:', err)
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }, [language])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showResults) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = `/blog/${results[selectedIndex].slug}`
        } else if (query.trim()) {
          // Navigate to search page for comprehensive results
          window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
    }
  }, [showResults, results, selectedIndex, query])

  // Memoize placeholder text
  const placeholderText = useMemo(() => 
    language === 'vi' ? 'Tìm kiếm bài viết...' : 'Search articles...', 
    [language]
  )

  // Memoize no results text
  const noResultsText = useMemo(() => 
    language === 'vi' ? 'Không tìm thấy kết quả' : 'No results found', 
    [language]
  )

  // Memoize loading text
  const loadingText = useMemo(() => 
    language === 'vi' ? 'Đang tìm kiếm...' : 'Searching...', 
    [language]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowResults(true)
    setSelectedIndex(-1)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    setSelectedIndex(-1)
    onSearch?.('')
  }

  const handleResultClick = () => {
    setShowResults(false)
    setSelectedIndex(-1)
  }

  const inputHeight = compact ? 'h-8' : 'h-10'
  const inputPadding = compact ? 'py-1' : 'py-2'

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        {!hideIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder={placeholderText}
          style={{ color: 'var(--color-gray-900)' }}
          className={`search-input w-full pr-8 ${inputHeight} ${inputPadding} border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
            hideIcon ? 'pl-3' : 'pl-9'
          }`}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (query.trim() || loading) && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              {loadingText}
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {noResultsText}
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <Link
                  key={result.id}
                  href={`/blog/${result.slug}`}
                  onClick={() => handleResultClick()}
                  className={`group block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                      {result.thumbnail_url ? (
                        <Image
                          src={result.thumbnail_url}
                          alt={result.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4
                          className={`text-sm font-medium truncate transition-colors duration-200 text-[color:var(--color-gray-900)] group-hover:text-white ${index === selectedIndex ? 'text-white' : ''}`}
                        >
                          {result.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 