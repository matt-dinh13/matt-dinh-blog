'use client'

import { BlogPostCard } from '@/components/BlogPostCard'
import { getThumbnailUrl, formatDate } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface Post {
  id: number
  slug: string
  thumbnail_url: string | null
  published_at: string | null
  created_at: string
  blog_post_translations: Array<{
    language_code: string
    title: string
    summary: string
    content: string
  }>
}

interface HomepagePostsProps {
  posts: Post[]
  language: 'vi' | 'en'
}

export function HomepagePosts({ posts, language }: HomepagePostsProps) {
  const renderedPosts = posts.map((post) => {
    const translations = post.blog_post_translations || []
    const translation = translations.find(t => t.language_code === language)
    
    if (!translation) {
      logger.warn('Translation not found for post', { 
        component: 'homepage-posts',
        data: { 
          postId: post.id, 
          language, 
          availableLanguages: translations.map(t => t.language_code) 
        } 
      })
      return null
    }

    // Create a wrapper function for formatDate that includes the language
    const formatDateWithLanguage = (dateString: string) => formatDate(dateString, language)

    return (
      <BlogPostCard
        key={post.id}
        post={post}
        translation={translation}
        thumbnailUrl={getThumbnailUrl(post.thumbnail_url)}
        formatDate={formatDateWithLanguage}
        language={language}
      />
    )
  }).filter(Boolean)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {renderedPosts}
    </div>
  )
}
