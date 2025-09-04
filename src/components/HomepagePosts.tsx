'use client'

import { useLanguage } from '@/components/LanguageProvider'
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
}

export function HomepagePosts({ posts }: HomepagePostsProps) {
  const { language } = useLanguage()

  const renderedPosts = posts.map((post) => {
    const translations = post.blog_post_translations || []
    
    // Find translation for current language or fallback to Vietnamese
    const translation = translations.find(t => t.language_code === language) || 
                       translations.find(t => t.language_code === 'vi') || 
                       translations[0]

    if (!translation) {
      logger.warn('No translation found for homepage post', {
        component: 'HomepagePosts',
        data: { postId: post.id, language }
      })
      return null
    }

    return (
      <BlogPostCard
        key={post.id}
        post={post}
        translation={translation}
        thumbnailUrl={getThumbnailUrl(post.thumbnail_url)}
        formatDate={(dateString: string) => formatDate(dateString, language)}
        language={language}
      />
    )
  }).filter(Boolean)

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {renderedPosts}
    </div>
  )
} 