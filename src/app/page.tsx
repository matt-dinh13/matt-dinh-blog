'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useLanguage } from '@/components/LanguageProvider'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { BlogPostCard } from '@/components/BlogPostCard'
import { HeroSection } from '@/components/HeroSection'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { LoadMoreButton } from '@/components/LoadMoreButton'
import { POSTS_PER_PAGE, formatDate, getThumbnailUrl, handleError } from '@/lib/utils'

// Types
interface BlogPost {
  id: number
  slug: string
  thumbnail_url: string | null
  published_at: string | null
  created_at: string
  blog_post_translations: Array<{
    language_code: string
    title: string
    summary: string
  }>
  categories?: {
    id: number
    slug: string
    category_translations: Array<{
      name: string
      language_code: string
    }>
  }
}

interface HomePageState {
  posts: BlogPost[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  page: number
}

export default function Home() {
  const { language } = useLanguage()
  const [state, setState] = useState<HomePageState>({
    posts: [],
    loading: true,
    loadingMore: false,
    hasMore: true,
    page: 1
  })

  // Memoized utility functions
  const formatDateCallback = useCallback((dateString: string) => {
    return formatDate(dateString, language)
  }, [language])

  const getThumbnailUrlCallback = useCallback((post: BlogPost) => {
    return getThumbnailUrl(post.thumbnail_url)
  }, [])

  // Optimized fetch function with proper error handling
  const fetchLatestPosts = useCallback(async () => {
    try {
      console.log('🏠 Homepage: Fetching latest posts...')
      
      const supabase = createClient()
      
      // Single optimized query with joins
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          thumbnail_url,
          published_at,
          created_at,
          blog_post_translations!inner(
            language_code,
            title,
            summary
          ),
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

      if (postsError) {
        console.error('❌ Homepage: Posts query failed:', postsError)
        throw new Error(`Posts query failed: ${postsError.message}`)
      }

      // Check if there are more posts available
      const { count: totalCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      setState(prev => ({
        ...prev,
        posts: postsData || [],
        hasMore: (totalCount || 0) > POSTS_PER_PAGE,
        loading: false
      }))
      
          } catch (err: any) {
        handleError(err, 'Homepage: Error fetching posts')
        setState(prev => ({
          ...prev,
          posts: [],
          loading: false
        }))
      }
  }, [language])

  // Optimized load more function
  const loadMorePosts = useCallback(async () => {
    if (state.loadingMore || !state.hasMore) return

    setState(prev => ({ ...prev, loadingMore: true }))
    
    try {
      const supabase = createClient()
      const nextPage = state.page + 1
      const offset = (nextPage - 1) * POSTS_PER_PAGE

      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          thumbnail_url,
          published_at,
          created_at,
          blog_post_translations!inner(
            language_code,
            title,
            summary
          ),
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

      if (postsError) {
        console.error('❌ Homepage: Load more posts query failed:', postsError)
        return
      }

      // Check if there are more posts after this batch
      const { count: totalCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      setState(prev => ({
        ...prev,
        posts: [...prev.posts, ...(postsData || [])],
        hasMore: (totalCount || 0) > offset + (postsData?.length || 0),
        page: nextPage,
        loadingMore: false
      }))

    } catch (err: any) {
      console.error('💥 Homepage: Error loading more posts:', err)
      setState(prev => ({ ...prev, loadingMore: false }))
    }
  }, [state.loadingMore, state.hasMore, state.page, language])

  // Fetch posts on mount and language change
  useEffect(() => {
    fetchLatestPosts()
  }, [fetchLatestPosts])

  // Memoized rendered posts
  const renderedPosts = useMemo(() => {
    if (state.loading) return null

    return state.posts.map((post) => {
      const translation = post.blog_post_translations?.find(
        (t) => t.language_code === language
      ) || post.blog_post_translations?.[0]

      if (!translation) {
        console.log('⚠️ Homepage: No translation found for post:', post.id, 'language:', language)
        return null
      }

      return (
        <BlogPostCard
          key={post.id}
          post={post}
          translation={translation}
          thumbnailUrl={getThumbnailUrlCallback(post)}
          formatDate={formatDateCallback}
          language={language}
        />
      )
    }).filter(Boolean)
  }, [state.posts, state.loading, language, getThumbnailUrl, formatDate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <HeroSection language={language} />
      
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
        {state.loading ? (
          <LoadingSpinner language={language} />
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {renderedPosts}
            </div>

            {/* Load More Button */}
            {state.hasMore && (
              <LoadMoreButton
                loading={state.loadingMore}
                onLoadMore={loadMorePosts}
                language={language}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
