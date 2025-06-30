"use client"

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const CARD_TEXT_COLOR = { color: 'oklch(21% .034 264.665)' }
const POSTS_PER_PAGE = 6

interface CategoryArticleListClientProps {
  categoryId: string
  language: string
}

export default function CategoryArticleListClient({ categoryId, language }: CategoryArticleListClientProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Memoize formatDate
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [language])

  // Memoize getThumbnailUrl
  const getThumbnailUrl = useCallback((post: any) => {
    if (post.thumbnail_url) {
      return post.thumbnail_url
    }
    return '/cover.jpg'
  }, [])

  // Optimized fetch function with joins
  const fetchPosts = useCallback(async (pageNum: number) => {
    if (pageNum === 1) setLoading(true)
    const supabase = createClient()
    const offset = (pageNum - 1) * POSTS_PER_PAGE
    // Single optimized query with joins
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_translations!inner(*),
        categories(
          id, 
          slug, 
          category_translations(name, language_code)
        )
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .eq('blog_post_translations.language_code', language)
      .order('published_at', { ascending: false })
      .range(offset, offset + POSTS_PER_PAGE - 1)
    if (postsError) {
      setLoading(false)
      setLoadingMore(false)
      return
    }
    if (!postsData || postsData.length === 0) {
      setHasMore(false)
      setLoading(false)
      setLoadingMore(false)
      if (pageNum === 1) setPosts([])
      return
    }
    setHasMore(postsData.length === POSTS_PER_PAGE)
    if (pageNum === 1) {
      setPosts(postsData)
    } else {
      setPosts(prev => [...prev, ...postsData])
    }
    setLoading(false)
    setLoadingMore(false)
    setPage(pageNum)
  }, [categoryId, language])

  useEffect(() => {
    fetchPosts(1)
    // eslint-disable-next-line
  }, [categoryId, language])

  const loadMorePosts = useCallback(() => {
    setLoadingMore(true)
    fetchPosts(page + 1)
  }, [fetchPosts, page])

  // Memoize rendered posts
  const renderedPosts = useMemo(() => {
    if (loading) return null
    return posts.map((post: any) => {
      const translation = post.blog_post_translations?.find((t: any) => t.language_code === language) || post.blog_post_translations?.[0]
      const thumbnailUrl = getThumbnailUrl(post)
      return (
        <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200" style={CARD_TEXT_COLOR}>
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail Section */}
            <div className="md:w-1/4">
              <Link href={`/blog/${post.slug}`} className="block relative h-48 md:h-full bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                <Image
                  src={thumbnailUrl}
                  alt={translation?.title || post.slug}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </Link>
            </div>
            {/* Content Section */}
            <div className="md:w-3/4 p-6">
              <header className="mb-4">
                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    <span className="block transition-colors duration-200 group-hover:text-blue-600">
                      {translation?.title || post.slug}
                    </span>
                  </Link>
                </h2>
                <p className="text-lg mb-4 text-gray-600 dark:text-gray-400">
                  {translation?.summary}
                </p>
              </header>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                  <span>{language === 'vi' ? 'Đọc tiếp' : 'Read more'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      )
    }).filter(Boolean)
  }, [posts, loading, language, getThumbnailUrl, formatDate])

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</div>
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400">No articles found in this category.</div>
  }

  return (
    <div className="space-y-6">
      {renderedPosts}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMorePosts}
            disabled={loadingMore}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loadingMore ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                {language === 'vi' ? 'Đang tải...' : 'Loading...'}
              </>
            ) : (
              language === 'vi' ? 'Tải thêm bài viết' : 'Load More Posts'
            )}
          </button>
        </div>
      )}
    </div>
  )
} 