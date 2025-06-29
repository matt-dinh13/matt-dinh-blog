'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, Loader2 } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default function Home() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const postsPerPage = 6
  const [categories, setCategories] = useState<any[]>([])

  console.log('🏠 Homepage: Component loaded - postsPerPage:', postsPerPage, 'language:', language)

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        console.log('🏠 Homepage: Starting to fetch latest posts...')
        console.log('🌍 Homepage: Current language:', language)
        
        const supabase = createClient()
        console.log('✅ Homepage: Supabase client created successfully')
        
        // Fetch blog posts and translations separately to avoid relationship issues
        console.log('📝 Homepage: Fetching blog posts...')
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(postsPerPage)

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

        console.log('🔍 Homepage: Raw posts data:', postsData.map((p: any) => ({ id: p.id, slug: p.slug, published_at: p.published_at })))

        // Check if there are more posts available
        const { count: totalCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')

        console.log('📊 Homepage: Total posts count:', totalCount, 'postsPerPage:', postsPerPage)
        setHasMore((totalCount || 0) > postsPerPage)

        // Fetch translations for these posts
        console.log('🌐 Homepage: Fetching translations...')
        const postIds = postsData.map((post: any) => post.id)
        const { data: translationsData, error: translationsError } = await supabase
          .from('blog_post_translations')
          .select('*')
          .in('blog_post_id', postIds)

        console.log('📊 Homepage: Translations query result:', { data: translationsData, error: translationsError, count: translationsData?.length || 0 })

        if (translationsError) {
          console.error('❌ Homepage: Translations query failed:', translationsError)
          throw new Error(`Translations query failed: ${translationsError.message}`)
        }

        // Combine posts with their translations
        const postsWithTranslations = postsData.map((post: any) => ({
          ...post,
          translations: translationsData?.filter((t: any) => t.blog_post_id === post.id) || []
        }))

        // Fetch categories for these posts
        const categoryIds = Array.from(new Set(postsData.map((p: any) => p.category_id).filter(Boolean)))
        let categoriesData: any[] = []
        if (categoryIds.length > 0) {
          const { data: cats } = await supabase
            .from('categories')
            .select('id, slug, category_translations(name, language_code)')
            .in('id', categoryIds)
          categoriesData = cats || []
        }
        setCategories(categoriesData)
        setPosts(postsWithTranslations)
        
      } catch (err: any) {
        console.error('💥 Homepage: Error fetching posts:', err)
        console.error('💥 Homepage: Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        })
        // Don't throw, just set empty posts to avoid breaking the page
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPosts()
  }, [language])

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const supabase = createClient()
      const nextPage = page + 1
      const offset = (nextPage - 1) * postsPerPage

      // Fetch next batch of posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + postsPerPage - 1)

      console.log('🔍 Homepage: Load more - offset:', offset, 'range:', offset, 'to', offset + postsPerPage - 1)
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

      // Fetch translations for new posts
      const postIds = postsData.map((post: any) => post.id)
      const { data: translationsData, error: translationsError } = await supabase
        .from('blog_post_translations')
        .select('*')
        .in('blog_post_id', postIds)

      if (translationsError) {
        console.error('❌ Homepage: Load more translations query failed:', translationsError)
        return
      }

      // Combine new posts with their translations
      const newPostsWithTranslations = postsData.map((post: any) => ({
        ...post,
        translations: translationsData?.filter((t: any) => t.blog_post_id === post.id) || []
      }))

      // Add new posts to existing posts
      setPosts(prevPosts => [...prevPosts, ...newPostsWithTranslations])
      setPage(nextPage)

    } catch (err: any) {
      console.error('💥 Homepage: Error loading more posts:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Function to get thumbnail URL with fallback
  const getThumbnailUrl = (post: any) => {
    if (post.thumbnail_url) {
      return post.thumbnail_url
    }
    // Fallback to a placeholder image
    return '/window.svg'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
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
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            {language === 'vi' ? 'Bài viết mới nhất' : 'Latest Articles'}
          </h2>
          <p className="text-lg text-white">
            {language === 'vi'
              ? 'Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi'
              : 'Discover insights, experiences, and knowledge from my journey'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4" style={cardTextColor}>
              {language === 'vi' ? 'Đang tải bài viết...' : 'Loading posts...'}
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400" style={cardTextColor}>
              {language === 'vi' 
                ? 'Chưa có bài viết nào được xuất bản.'
                : 'No published posts yet.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                console.log('🎨 Homepage: Rendering posts, total posts:', posts.length)
                let renderedCount = 0
                let filteredCount = 0
                
                const renderedPosts = posts.map((post: any) => {
                  const translation = post.translations?.find((t: any) => t.language_code === language) || post.translations?.[0]

                  if (!translation) {
                    console.log('⚠️ Homepage: No translation found for post:', post.id, 'language:', language)
                    filteredCount++
                    return null
                  }

                  renderedCount++
                  const thumbnailUrl = getThumbnailUrl(post)
                  const isPlaceholder = !post.thumbnail_url

                  // Category badge
                  const category = categories.find((cat: any) => cat.id === post.category_id)
                  const categoryName = category ? (category.category_translations.find((t: any) => t.language_code === language)?.name || category.slug) : (language === 'vi' ? 'Bài viết' : 'Post')
                  const categorySlug = category ? category.slug : null

                  return (
                    <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col" style={cardTextColor}>
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
                        {/* Category Badge */}
                        <div className="flex items-center justify-between mb-3">
                          {categorySlug ? (
                            <Link
                              href={`/blog/category/${categorySlug}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
                            >
                              {categoryName}
                            </Link>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {categoryName}
                            </span>
                          )}
                        </div>
                        
                        {/* Title (block link) */}
                        <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[3em]" style={cardTextColor}>
                          <Link
                            href={`/blog/${post.slug}`}
                            style={cardTextColor}
                            className="block w-full py-1 px-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
                          >
                            <span
                              className="block transition-colors duration-200 group-hover:text-blue-600"
                              style={cardTextColor}
                            >
                              {translation.title}
                            </span>
                          </Link>
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="mb-4 line-clamp-3 min-h-[4.5em] text-sm" style={cardTextColor}>
                          {translation.summary}
                        </p>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs mb-4" style={cardTextColor}>
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>{formatDate(post.published_at || post.created_at)}</span>
                          </div>
                        </div>
                        
                        {/* Read More Link */}
                        <div className="mt-auto">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center font-medium text-sm transition-colors duration-200 hover:text-blue-600"
                            style={cardTextColor}
                          >
                            {language === 'vi' ? 'Đọc tiếp' : 'Read more'}
                            <ArrowRight size={14} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })
                
                console.log('🎨 Homepage: Render summary - rendered:', renderedCount, 'filtered:', filteredCount, 'total:', posts.length)
                return renderedPosts
              })()}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 shadow"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                    </>
                  ) : (
                    <>
                      {language === 'vi' ? 'Thêm bài viết' : 'Load More Articles'}
                      <ArrowRight size={16} className="ml-2" />
                    </>
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
