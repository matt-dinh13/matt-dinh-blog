'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import BlogCard from '@/components/BlogCard'
import { Loader2 } from 'lucide-react'

// Move constants outside component to prevent re-renders
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
    content: string
  }>
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

export default function BlogListClient() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // Memoize the getThumbnailUrl function
  const getThumbnailUrl = useCallback((post: Post) => {
    if (post.thumbnail_url) {
      return post.thumbnail_url
    }
    return '/window.svg'
  }, [])

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
        console.error('❌ Blog: Load more - posts query failed:', postsError)
        throw new Error(`Load more posts query failed: ${postsError.message}`)
      }

      if (postsData && postsData.length > 0) {
        // Transform posts to match expected format
        const newPostsWithTranslations = postsData.map((post: any) => ({
          ...post,
          translations: post.blog_post_translations || []
        }))

        setPosts(prevPosts => [...prevPosts, ...newPostsWithTranslations])
        setPage(nextPage)
        
        // Check if there are more posts
        const { count: totalCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
        
        setHasMore((totalCount || 0) > (posts.length + newPostsWithTranslations.length))
      } else {
        setHasMore(false)
      }
    } catch (err: any) {
      console.error('💥 Blog: Error loading more posts:', err)
      console.error('💥 Blog: Load more error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page, language])

  // Memoize rendered posts to prevent unnecessary re-renders
  const renderedPosts = useMemo(() => {
    return posts.map((post) => {
      const translation = post.translations.find(t => t.language_code === language) || post.translations[0]
      if (!translation) {
        console.warn('⚠️ Blog: No translation found for post:', post.id, 'Available translations:', post.translations)
        return null
      }

      const thumbnailUrl = getThumbnailUrl(post)

      return (
        <BlogCard
          key={post.id}
          slug={post.slug}
          title={translation.title}
          description={stripHtml(translation.content).slice(0, 256)}
          thumbnailUrl={thumbnailUrl}
          publishedAt={post.published_at || post.created_at}
          locale={language === 'vi' ? 'vi-VN' : 'en-US'}
        />
      )
    })
  }, [posts, language, getThumbnailUrl])

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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