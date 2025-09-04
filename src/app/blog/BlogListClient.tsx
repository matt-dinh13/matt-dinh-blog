'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import BlogCard from '@/components/BlogCard'
import { Loader2 } from 'lucide-react'
import { processTranslationsWithSummaries } from '@/lib/summary-generator'
import { logger } from '@/lib/logger'

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
  // Direct fields (for backward compatibility)
  title?: string
  summary?: string
  content?: string
  // Translations array
  blog_post_translations: Array<{
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

interface BlogListClientProps {
  initialPosts?: any[]
  error?: string
}

export default function BlogListClient({ initialPosts = [], error: initialError }: BlogListClientProps) {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(initialPosts.length === 0 && !initialError)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(initialError || null)

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
      logger.dbQuery('Starting to fetch blog posts', { 
        component: 'BlogListClient',
        data: { language, postsPerPage: POSTS_PER_PAGE }
      })
      
      const supabase = createClient()
      
      // First, let's test if we can get any posts at all
      const { data: testPosts, error: testError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .limit(5)

      logger.dbQuery('Test query completed', {
        component: 'BlogListClient',
        data: { count: testPosts?.length || 0, hasError: !!testError }
      })

      if (testError) {
        logger.error('Test query failed', {
          component: 'BlogListClient',
          error: testError
        })
        throw new Error(`Test query failed: ${testError.message}`)
      }

      if (!testPosts || testPosts.length === 0) {
        logger.warn('No published posts found in database', {
          component: 'BlogListClient',
          data: { language }
        })
        setPosts([])
        setHasMore(false)
        setError('No blog posts found. Please add some posts to your database.')
        return
      }

      // Now let's get the full data with translations
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_post_translations(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(POSTS_PER_PAGE)

      logger.dbQuery('Full posts query completed', {
        component: 'BlogListClient',
        data: { count: postsData?.length || 0, hasError: !!postsError }
      })

      if (postsError) {
        logger.error('Posts query failed', {
          component: 'BlogListClient',
          error: postsError
        })
        throw new Error(`Posts query failed: ${postsError.message}`)
      }

      if (!postsData || postsData.length === 0) {
        logger.warn('No published posts found with translations', {
          component: 'BlogListClient',
          data: { language }
        })
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

      logger.dbQuery('Posts count query completed', {
        component: 'BlogListClient',
        data: { totalCount, postsPerPage: POSTS_PER_PAGE }
      })
      setHasMore((totalCount || 0) > POSTS_PER_PAGE)

      // Transform posts to match expected format and process summaries
      const postsWithTranslations = postsData.map((post: any) => ({
        ...post,
        translations: post.blog_post_translations || [],
        blog_post_translations: processTranslationsWithSummaries(post.blog_post_translations || [])
      }))

      logger.info('Blog posts fetched successfully', {
        component: 'BlogListClient',
        data: { count: postsWithTranslations.length, language }
      })
      setPosts(postsWithTranslations)
      
    } catch (err: any) {
      logger.error('Error fetching blog posts', {
        component: 'BlogListClient',
        error: err instanceof Error ? err : new Error(String(err))
      })
      setError(err.message || 'Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    // Only fetch posts if we don't have initial posts and no error
    if (initialPosts.length === 0 && !initialError) {
      fetchPosts()
    }
  }, [fetchPosts, initialPosts.length, initialError])

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
          blog_post_translations(*),
          categories(
            id, 
            slug, 
            category_translations(name, language_code)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1)

      logger.dbQuery('Load more posts query executed', {
        component: 'BlogListClient',
        data: { offset, range: `${offset}-${offset + POSTS_PER_PAGE - 1}`, count: postsData?.length || 0 }
      })

      if (postsError) {
        logger.error('Load more posts query failed', {
          component: 'BlogListClient',
          error: postsError
        })
        throw new Error(`Load more posts query failed: ${postsError.message}`)
      }

      if (postsData && postsData.length > 0) {
        // Transform posts to match expected format and process summaries
        const newPostsWithTranslations = postsData.map((post: any) => ({
          ...post,
          translations: post.blog_post_translations || [],
          blog_post_translations: processTranslationsWithSummaries(post.blog_post_translations || [])
        }))

        // Get total count first
        const { count: totalCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')

        setPosts(prevPosts => {
          const updatedPosts = [...prevPosts, ...newPostsWithTranslations]
          
          // Check if there are more posts using the updated posts array
          setHasMore((totalCount || 0) > updatedPosts.length)
          
          return updatedPosts
        })
        setPage(nextPage)
      } else {
        setHasMore(false)
      }
    } catch (err: any) {
      logger.error('Error loading more posts', {
        component: 'BlogListClient',
        error: err instanceof Error ? err : new Error(String(err))
      })
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page, language])

  // Memoize rendered posts to prevent unnecessary re-renders
  const renderedPosts = useMemo(() => {
    return posts.map((post) => {
      // Handle both data structures: direct fields and translations array
      let translation = null
      
      // First, try to get from blog_post_translations array
      const translations = post.blog_post_translations || []
      if (translations && translations.length > 0) {
        translation = translations.find(t => t.language_code === language) || translations[0]
      }
      
      // If no translation found in array, try direct fields (fallback for old data structure)
      if (!translation) {
        // Check if post has direct title/summary/content fields
        if (post.title || post.summary || post.content) {
          translation = {
            language_code: 'vi', // Default to Vietnamese for direct fields
            title: post.title || 'Untitled',
            summary: post.summary || '',
            content: post.content || ''
          }
        }
      }
      
      // If still no translation, log warning and skip
      if (!translation) {
        logger.warn('No translation found for post', {
          component: 'BlogListClient',
          data: { postId: post.id, availableTranslations: translations.length, language }
        })
        return null
      }

      const thumbnailUrl = getThumbnailUrl(post)
      
      // Create description from content or summary
      const description = translation.summary && translation.summary.trim() 
        ? translation.summary 
        : stripHtml(translation.content || '').slice(0, 256)

      return (
        <BlogCard
          key={`${post.id}-${post.slug}-${language}`}
          slug={post.slug}
          title={translation.title || 'Untitled'}
          description={description}
          thumbnailUrl={thumbnailUrl}
          publishedAt={post.published_at || post.created_at}
          locale={language === 'vi' ? 'vi-VN' : 'en-US'}
        />
      )
    }).filter(Boolean) // Remove null items
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {pageContent.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {pageContent.description}
          </p>
        </div>

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