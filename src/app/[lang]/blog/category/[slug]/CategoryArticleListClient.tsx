'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

interface Post {
  id: number
  slug: string
  title: string
  summary: string
  thumbnail_url?: string
  published_at: string
  created_at: string
}

interface CategoryArticleListClientProps {
  categoryId: number
  language: string
}

export default function CategoryArticleListClient({ categoryId, language }: CategoryArticleListClientProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id,
            slug,
            thumbnail_url,
            published_at,
            created_at,
            blog_post_translations!inner(
              title,
              summary,
              language_code
            )
          `)
          .eq('category_id', categoryId)
          .eq('status', 'published')
          .eq('blog_post_translations.language_code', language)
          .order('published_at', { ascending: false })

        if (error) {
          throw error
        }

        // Transform the data to match the expected format
        const transformedPosts = data?.map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.blog_post_translations[0]?.title || '',
          summary: post.blog_post_translations[0]?.summary || '',
          thumbnail_url: post.thumbnail_url,
          published_at: post.published_at,
          created_at: post.created_at
        })) || []

        setPosts(transformedPosts)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [categoryId, language])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {language === 'vi' ? 'Đang tải...' : 'Loading...'}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          {language === 'vi' ? 'Có lỗi xảy ra khi tải bài viết.' : 'Error loading posts.'}
        </p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'vi' ? 'Chưa có bài viết nào trong chuyên mục này.' : 'No posts found in this category.'}
        </p>
        <Link 
          href={`/${language}/blog`}
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          {language === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          slug={post.slug}
          title={post.title}
          description={post.summary}
          thumbnailUrl={post.thumbnail_url}
          publishedAt={post.published_at}
          locale={language === 'vi' ? 'vi-VN' : 'en-US'}
        />
      ))}
    </div>
  )
} 