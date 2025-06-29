'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, Loader2 } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'

// Move constants outside component to prevent re-renders
const CARD_TEXT_COLOR = { color: 'oklch(21% .034 264.665)' }
const POSTS_PER_PAGE = 6

interface Post {
  id: string
  slug: string
  status: string
  published_at: string
  created_at: string
  thumbnail_url?: string
  category_id?: string
  translations: Array<{
    language_code: string
    title: string
    summary: string
  }>
}

interface Category {
  id: string
  slug: string
  category_translations: Array<{
    name: string
    language_code: string
  }>
}

export default function BlogListClient() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // Memoize the formatDate function to prevent unnecessary re-renders
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [language])

  // Memoize the getThumbnailUrl function
  const getThumbnailUrl = useCallback((post: Post) => {
    if (post.thumbnail_url) {
      return post.thumbnail_url
    }
    return '/window.svg'
  }, [])

  // Memoize the getCategoryName function
  const getCategoryName = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) {
      console.log('⚠️ Blog: Category not found for ID:', categoryId, 'Available categories:', categories.map(c => c.id))
      return null
    }
    
    const translation = category.category_translations?.find(t => t.language_code === language) || 
                       category.category_translations?.[0]
    return translation?.name || null
  }, [categories, language])

  // Optimized fetch function with proper joins
  const fetchPosts = useCallback(async () => {
    try {
      console.log('🔍 Blog: Starting to fetch posts...')
      console.log('🌍 Blog: Current language:', language)
      
      const supabase = createClient()
      console.log('✅ Blog: Supabase client created successfully')
      
      // Single optimized query with joins instead of multiple queries
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
        .eq('status', 'published')
        .eq('blog_post_translations.language_code', language)
        .order('published_at', { ascending: false })
        .limit(POSTS_PER_PAGE)

      console.log('📊 Blog: Posts query result:', { data: postsData, error: postsError, count: postsData?.length || 0 })

      if (postsError) {
        console.error('❌ Blog: Posts query failed:', postsError)
        throw new Error(`Posts query failed: ${postsError.message}`)
      }

      if (!postsData || postsData.length === 0) {
        console.log('⚠️ Blog: No published posts found')
        setPosts([])
        setHasMore(false)
        setError('No blog posts found. Please add some posts to your database.')
        return
      }

      // Check if there are more posts available (optimized count query)
      const { count: totalCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      console.log('📊 Blog: Total posts count:', totalCount, 'postsPerPage:', POSTS_PER_PAGE)
      setHasMore((totalCount || 0) > POSTS_PER_PAGE)

      // Extract categories from the joined data
      const categoriesData = postsData
        .map((post: any) => post.categories)
        .filter(Boolean)
        .reduce((acc: Category[], category: any) => {
          if (!acc.find(cat => cat.id === category.id)) {
            acc.push(category)
          }
          return acc
        }, [])

      setCategories(categoriesData)

      // Transform posts to match expected format
      const postsWithTranslations = postsData.map((post: any) => ({
        ...post,
        translations: post.blog_post_translations || []
      }))

      console.log('✅ Blog: Successfully combined posts with translations:', postsWithTranslations.length, 'posts')
      setPosts(postsWithTranslations)
      
    } catch (err: any) {
      console.error('💥 Blog: Error fetching posts:', err)
      console.error('💥 Blog: Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      setError(err.message || 'Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Optimized load more function
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const supabase = createClient()
      const nextPage = page + 1
      const offset = (nextPage - 1) * POSTS_PER_PAGE

      // Single optimized query for load more
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
        .eq('status', 'published')
        .eq('blog_post_translations.language_code', language)
        .order('published_at', { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1)

      console.log('🔍 Blog: Load more - offset:', offset, 'range:', offset, 'to', offset + POSTS_PER_PAGE - 1)
      console.log('📊 Blog: Load more - posts fetched:', postsData?.length || 0)

      if (postsError) {
        console.error('❌ Blog: Load more posts query failed:', postsError)
        return
      }

      if (!postsData || postsData.length === 0) {
        setHasMore(false)
        return
      }

      // Check if there are more posts after this batch
      const { count: totalCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      setHasMore((totalCount || 0) > offset + postsData.length)

      // Extract new categories
      const newCategories = postsData
        .map((post: any) => post.categories)
        .filter(Boolean)
        .reduce((acc: Category[], category: any) => {
          if (!acc.find((cat: any) => cat.id === category.id)) {
            acc.push(category)
          }
          return acc
        }, [])

      // Add new categories to existing ones
      setCategories((prevCategories: Category[]) => {
        const existingIds = prevCategories.map((cat: Category) => cat.id)
        const uniqueNewCategories = newCategories.filter((cat: Category) => !existingIds.includes(cat.id))
        return [...prevCategories, ...uniqueNewCategories]
      })

      // Transform new posts to match expected format
      const newPostsWithTranslations = postsData.map((post: any) => ({
        ...post,
        translations: post.blog_post_translations || []
      }))

      // Add new posts to existing posts
      setPosts(prevPosts => [...prevPosts, ...newPostsWithTranslations])
      setPage(nextPage)

    } catch (err: any) {
      console.error('💥 Blog: Error loading more posts:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page, language])

  // Memoize the rendered posts to prevent unnecessary re-renders
  const renderedPosts = useMemo(() => {
    if (loading) return null

    return posts.map((post: Post) => {
      const translation = post.translations?.find((t: any) => t.language_code === language) || post.translations?.[0]

      if (!translation) {
        console.log('⚠️ Blog: No translation found for post:', post.id, 'language:', language)
        return null
      }

      const thumbnailUrl = getThumbnailUrl(post)
      const isPlaceholder = !post.thumbnail_url
      const categoryName = post.category_id ? getCategoryName(post.category_id) : null

      return (
        <article 
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
          style={CARD_TEXT_COLOR}
        >
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail Section */}
            <div className="md:w-1/4">
              <Link href={`/blog/${post.slug}`} className="block relative h-48 md:h-full bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                {isPlaceholder ? (
                  // Placeholder thumbnail
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
                    <Image
                      src={thumbnailUrl}
                      alt={translation.title}
                      width={64}
                      height={64}
                      className="object-contain opacity-60 group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                ) : (
                  // Real thumbnail from database
                  <Image
                    src={thumbnailUrl}
                    alt={translation.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                )}
              </Link>
            </div>

            {/* Content Section */}
            <div className="md:w-3/4 p-6">
              <header className="mb-4">
                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="block w-full rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
                  >
                    <span
                      className="block transition-colors duration-200 group-hover:text-blue-600"
                      style={{ color: 'var(--color-gray-900)', filter: 'unset' }}
                    >
                      {translation.title}
                    </span>
                  </Link>
                </h2>
                
                <p className="text-base mb-4 leading-relaxed text-gray-600 dark:text-gray-400">
                  {translation.summary}
                </p>
              </header>

              <div className="flex items-center justify-start text-sm mb-4 text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
              </div>

              <div className="mt-auto">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
                >
                  <span>{language === 'vi' ? 'Đọc thêm' : 'Read more'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      )
    })
  }, [posts, language, getThumbnailUrl, getCategoryName, formatDate, categories])

  // Memoize the breadcrumb items
  const breadcrumbItems = useMemo(() => [
    { label: 'Home', href: '/' }, 
    { label: language === 'vi' ? 'Blog' : 'Blog' }
  ], [language])

  // Memoize the page title and description
  const pageContent = useMemo(() => ({
    title: language === 'vi' ? 'Blog' : 'Blog',
    description: language === 'vi' 
      ? 'Những bài viết về công nghệ, lập trình và kinh nghiệm của tôi' 
      : 'Thoughts on technology, programming, and my experiences'
  }), [language])

  // Memoize the load more button content
  const loadMoreButtonContent = useMemo(() => ({
    loading: language === 'vi' ? 'Đang tải...' : 'Loading...',
    text: language === 'vi' ? 'Tải thêm bài viết' : 'Load More Posts'
  }), [language])

  // Memoize the error content
  const errorContent = useMemo(() => ({
    title: language === 'vi' ? 'Lỗi tải bài viết' : 'Error Loading Posts',
    noPosts: language === 'vi' ? 'Chưa có bài viết nào' : 'No posts yet',
    noPostsDesc: language === 'vi' 
      ? 'Hãy quay lại sau hoặc thêm một số bài viết vào cơ sở dữ liệu.' 
      : 'Check back later or add some posts to your database.'
  }), [language])

  // Memoize the loading content
  const loadingContent = useMemo(() => ({
    text: language === 'vi' ? 'Đang tải bài viết...' : 'Loading posts...'
  }), [language])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {loadingContent.text}
            </p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              {errorContent.title}
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <div className="text-sm text-red-600 dark:text-red-400">
              <p>Debug information:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Language: {language}</li>
                <li>Posts count: {posts.length}</li>
                <li>Check browser console for detailed logs</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    if (posts.length === 0) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {errorContent.noPosts}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {errorContent.noPostsDesc}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {pageContent.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {pageContent.description}
          </p>
        </div>

        <div className="space-y-6">
          {renderedPosts}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  {loadMoreButtonContent.loading}
                </>
              ) : (
                loadMoreButtonContent.text
              )}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {renderContent()}
      </main>
      <Footer />
    </>
  )
} 