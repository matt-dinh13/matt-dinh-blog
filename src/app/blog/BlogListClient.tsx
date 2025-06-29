'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'

interface Post {
  id: string
  slug: string
  status: string
  published_at: string
  created_at: string
  thumbnail_url?: string
  translations: Array<{
    language_code: string
    title: string
    summary: string
  }>
}

export default function BlogListClient() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        console.log('🔍 Blog: Starting to fetch posts...')
        console.log('🌍 Blog: Current language:', language)
        
        const supabase = createClient()
        console.log('✅ Blog: Supabase client created successfully')
        
        // Fetch published posts
        console.log('📝 Blog: Fetching published posts...')
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })

        console.log('📊 Blog: Posts query result:', { data: postsData, error: postsError, count: postsData?.length || 0 })

        if (postsError) {
          console.error('❌ Blog: Posts query failed:', postsError)
          throw new Error(`Posts query failed: ${postsError.message}`)
        }

        if (!postsData || postsData.length === 0) {
          console.log('⚠️ Blog: No published posts found')
          setPosts([])
          setError('No blog posts found. Please add some posts to your database.')
          return
        }

        // Fetch translations for these posts
        console.log('🌐 Blog: Fetching translations...')
        const postIds = postsData.map(post => post.id)
        const { data: translationsData, error: translationsError } = await supabase
          .from('blog_post_translations')
          .select('*')
          .in('blog_post_id', postIds)

        console.log('📊 Blog: Translations query result:', { data: translationsData, error: translationsError, count: translationsData?.length || 0 })

        if (translationsError) {
          console.error('❌ Blog: Translations query failed:', translationsError)
          throw new Error(`Translations query failed: ${translationsError.message}`)
        }

        // Combine posts with their translations
        const postsWithTranslations = postsData.map(post => ({
          ...post,
          translations: translationsData?.filter(t => t.blog_post_id === post.id) || []
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
    }

    fetchPosts()
  }, [language])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Function to get thumbnail URL with fallback
  const getThumbnailUrl = (post: Post) => {
    if (post.thumbnail_url) {
      return post.thumbnail_url
    }
    // Fallback to a placeholder image
    return '/window.svg'
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {language === 'vi' ? 'Đang tải bài viết...' : 'Loading posts...'}
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
            {language === 'vi' ? 'Lỗi tải bài viết' : 'Error Loading Posts'}
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
            {language === 'vi' ? 'Chưa có bài viết nào' : 'No posts yet'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'vi' 
              ? 'Hãy quay lại sau hoặc thêm một số bài viết vào cơ sở dữ liệu.' 
              : 'Check back later or add some posts to your database.'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'vi' ? 'Blog' : 'Blog'}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {language === 'vi' 
            ? 'Những bài viết về công nghệ, lập trình và kinh nghiệm của tôi' 
            : 'Thoughts on technology, programming, and my experiences'
          }
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => {
          const translation = post.translations?.find((t) => t.language_code === language) || post.translations?.[0]

          if (!translation) {
            console.log('⚠️ Blog: No translation found for post:', post.id, 'language:', language)
            return null
          }

          const thumbnailUrl = getThumbnailUrl(post)
          const isPlaceholder = !post.thumbnail_url

          return (
            <article 
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail Section */}
                <div className="md:w-1/3">
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
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </Link>
                </div>

                {/* Content Section */}
                <div className="md:w-2/3 p-6">
                  <header className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {language === 'vi' ? 'Bài viết' : 'Post'}
                      </span>
                      <div className="text-xs text-gray-500">
                        ID: {post.id} | Status: {post.status}
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {translation.title}
                      </Link>
                    </h2>
                    
                    <p className="text-lg mb-4 text-gray-600 dark:text-gray-400">
                      {translation.summary}
                    </p>
                  </header>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      <span>{language === 'vi' ? 'Đọc thêm' : 'Read more'}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
} 