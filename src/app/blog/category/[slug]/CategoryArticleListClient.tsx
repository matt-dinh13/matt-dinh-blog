"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

interface CategoryArticleListClientProps {
  categoryId: string
  categorySlug: string
  categoryName: string
  language: string
}

export default function CategoryArticleListClient({ categoryId, categorySlug, categoryName, language }: CategoryArticleListClientProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 6

  useEffect(() => {
    fetchPosts(1)
    // eslint-disable-next-line
  }, [categoryId, language])

  async function fetchPosts(pageNum: number) {
    if (pageNum === 1) setLoading(true)
    const supabase = createClient()
    const offset = (pageNum - 1) * postsPerPage
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + postsPerPage - 1)
    if (postsError) {
      setLoading(false)
      setLoadingMore(false)
      return
    }
    const postIds = postsData?.map((post: any) => post.id) || []
    let postsWithTranslations: any[] = []
    if (postIds.length > 0) {
      const { data: translationsData } = await supabase
        .from('blog_post_translations')
        .select('*')
        .in('blog_post_id', postIds)
      postsWithTranslations = (postsData || []).map((post: any) => ({
        ...post,
        translations: translationsData?.filter((t: any) => t.blog_post_id === post.id) || []
      }))
    }
    if (pageNum === 1) {
      setPosts(postsWithTranslations)
    } else {
      setPosts(prev => [...prev, ...postsWithTranslations])
    }
    setHasMore(postsWithTranslations.length === postsPerPage)
    setLoading(false)
    setLoadingMore(false)
    setPage(pageNum)
  }

  const loadMorePosts = () => {
    setLoadingMore(true)
    fetchPosts(page + 1)
  }

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</div>
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400">No articles found in this category.</div>
  }

  return (
    <div className="space-y-6">
      {posts.map((post: any) => {
        const translation = post.translations.find((t: any) => t.language_code === language) || post.translations[0]
        const thumbnailUrl = post.thumbnail_url || '/cover.jpg'
        return (
          <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200" style={cardTextColor}>
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
                  <div className="flex items-center justify-start mb-3">
                    <Link
                      href={`/blog/category/${categorySlug}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                    >
                      {categoryName}
                    </Link>
                  </div>
                  <h2 className="text-xl font-bold mb-3" style={cardTextColor}>
                    <Link href={`/blog/${post.slug}`}
                      className="block w-full rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group">
                      <span className="block transition-colors duration-200 group-hover:text-blue-600" style={cardTextColor}>
                        {translation?.title || post.slug}
                      </span>
                    </Link>
                  </h2>
                  <p className="text-base mb-4 leading-relaxed" style={cardTextColor}>
                    {translation?.summary}
                  </p>
                </header>
                <div className="flex items-center justify-start text-sm mb-4" style={cardTextColor}>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium">
                    <span>{language === 'vi' ? 'Đọc thêm' : 'Read more'}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )
      })}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMorePosts}
            disabled={loadingMore}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loadingMore ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {language === 'vi' ? 'Đang tải...' : 'Loading...'}
              </>
            ) : (
              language === 'vi' ? 'Tải thêm bài viết' : 'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  )
} 