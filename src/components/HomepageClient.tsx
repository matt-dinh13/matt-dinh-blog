'use client'

import { HeroSection } from '@/components/HeroSection'
import { HomepagePosts } from '@/components/HomepagePosts'

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

interface HomepageClientProps {
  posts: Post[]
  language: 'vi' | 'en'
}

export function HomepageClient({ posts, language }: HomepageClientProps) {
  // Language-specific content
  const content = {
    vi: {
      title: 'Bài viết mới nhất',
      description: 'Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi',
      noPosts: 'Không có bài viết nào được tìm thấy.',
      error: 'Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.'
    },
    en: {
      title: 'Latest Articles',
      description: 'Discover knowledge, experiences, and insights from my journey',
      noPosts: 'No articles found.',
      error: 'An error occurred while loading articles. Please try again later.'
    }
  }

  const currentContent = content[language as keyof typeof content] || content.vi

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection language={language} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentContent.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {currentContent.description}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts && posts.length > 0 ? (
          <HomepagePosts posts={posts} language={language} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {currentContent.noPosts}
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 
