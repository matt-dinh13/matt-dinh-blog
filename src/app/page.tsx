'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, Loader2 } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'

// Move constants outside component to prevent re-renders
const POSTS_PER_PAGE = 6

export default function Home() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Memoize the formatDate function to prevent unnecessary re-renders
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [language])

  // Memoize the getThumbnailUrl function
  const getThumbnailUrl = useCallback((post: any) => {
    if (post.thumbnail_url) {
      return post.thumbnail_url
    }
    return '/window.svg'
  }, [])

  // Optimized fetch function with proper joins
  const fetchLatestPosts = useCallback(async () => {
    try {
      console.log('🏠 Homepage: Starting to fetch latest posts...')
      console.log('🌍 Homepage: Current language:', language)
      
      const supabase = createClient()
      console.log('✅ Homepage: Supabase client created successfully')
      
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

      console.log('📊 Homepage: Posts query result:', { data: postsData, error: postsError, count: postsData?.length || 0 })

      if (postsError) {
        console.error('❌ Homepage: Posts query failed:', postsError)
        throw new Error(`Posts query failed: ${postsError.message}`)
      }

      if (!postsData || postsData.length === 0) {
        console.log('⚠️ Homepage: No published posts found')
        setPosts([])
        setHasMore(false)
        return
      }

      // Check if there are more posts available (optimized count query)
      const { count: totalCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      console.log('📊 Homepage: Total posts count:', totalCount, 'postsPerPage:', POSTS_PER_PAGE)
      setHasMore((totalCount || 0) > POSTS_PER_PAGE)

      setPosts(postsData)
      
    } catch (err: any) {
      console.error('💥 Homepage: Error fetching posts:', err)
      console.error('💥 Homepage: Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchLatestPosts()
  }, [fetchLatestPosts])

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

      console.log('🔍 Homepage: Load more - offset:', offset, 'range:', offset, 'to', offset + POSTS_PER_PAGE - 1)
      console.log('📊 Homepage: Load more - posts fetched:', postsData?.length || 0)

      if (postsError) {
        console.error('❌ Homepage: Load more posts query failed:', postsError)
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

      // Add new posts to existing posts
      setPosts(prevPosts => [...prevPosts, ...postsData])
      setPage(nextPage)

    } catch (err: any) {
      console.error('💥 Homepage: Error loading more posts:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page, language])

  // Memoize the rendered posts to prevent unnecessary re-renders
  const renderedPosts = useMemo(() => {
    if (loading) return null

    return posts.map((post: any) => {
      const translation = post.blog_post_translations?.find((t: any) => t.language_code === language) || post.blog_post_translations?.[0]

      if (!translation) {
        console.log('⚠️ Homepage: No translation found for post:', post.id, 'language:', language)
        return null
      }

      const thumbnailUrl = getThumbnailUrl(post)
      const isPlaceholder = !post.thumbnail_url

      return (
        <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
          {/* Thumbnail - now clickable */}
          <Link href={`/blog/${post.slug}`} className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 block group overflow-hidden">
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
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            )}
            <span className="sr-only">Go to {translation.title}</span>
          </Link>
          <div className="p-6 flex flex-col flex-1">
            {/* Title (block link) */}
            <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[3em] text-gray-900 dark:text-white">
              <Link
                href={`/blog/${post.slug}`}
                className="block w-full py-1 px-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
              >
                <span
                  className="block transition-colors duration-200 group-hover:text-blue-600"
                  style={{ color: 'var(--color-gray-900)', filter: 'unset' }}
                >
                  {translation.title}
                </span>
              </Link>
            </h3>
            
            {/* Excerpt */}
            <p className="mb-4 line-clamp-3 min-h-[4.5em] text-sm text-gray-600 dark:text-gray-400">
              {translation.summary}
            </p>
            
            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                <span>{language === 'vi' ? 'Đọc thêm' : 'Read more'}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </article>
      )
    }).filter(Boolean)
  }, [posts, loading, language, getThumbnailUrl, formatDate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Cover Section with real image, crop at 80% from top (20% from bottom) and reliable grey overlay */}
      <section className="relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="/covers/cover-home.jpg"
          alt="Homepage Cover"
          fill
          priority
          className="object-cover w-full h-full z-0"
          style={{ objectPosition: 'center 80%' }}
          sizes="100vw"
        />
        {/* Reliable grey overlay for readability */}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(17, 24, 39, 0.7)' }} />
        {/* Content */}
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg text-white">
            Matt Dinh Blog
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed drop-shadow text-white">
            {language === 'vi'
              ? 'Chia sẻ về cuộc sống, công việc và tri thức. Khám phá công nghệ, phát triển sự nghiệp và phát triển bản thân qua các bài viết và trải nghiệm.'
              : 'Sharing insights about life, work, and knowledge. Exploring technology, career growth, and personal development through thoughtful articles and experiences.'}
          </p>
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow"
            >
              {language === 'vi' ? 'Khám phá bài viết' : 'Explore Articles'}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {language === 'vi' ? 'Bài viết mới nhất' : 'Latest Articles'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === 'vi'
              ? 'Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi'
              : 'Discover insights, experiences, and knowledge from my journey'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">
              {language === 'vi' ? 'Đang tải bài viết...' : 'Loading posts...'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                      {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                    </>
                  ) : (
                    language === 'vi' ? 'Tải thêm bài viết' : 'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
