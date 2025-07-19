import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { BlogPostCard } from '@/components/BlogPostCard'
import { HeroSection } from '@/components/HeroSection'
import { POSTS_PER_PAGE, formatDate, getThumbnailUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Matt Dinh Blog',
  description: 'Personal blog sharing insights about life, work, and knowledge. Portfolio showcasing IT projects and career highlights.',
}

// Types are defined inline where needed

export default async function Home() {
  try {
    console.log('🔍 Server: Fetching latest posts for homepage...')
    
    const supabase = await createServerSupabaseClient()
    
    // Fetch latest posts with translations (default to Vietnamese)
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        thumbnail_url,
        published_at,
        created_at,
        blog_post_translations(
          language_code,
          title,
          summary,
          content
        ),
        categories(
          id, 
          slug, 
          category_translations(name, language_code)
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(POSTS_PER_PAGE)

    if (error) {
      console.error('❌ Server: Homepage posts query failed:', error)
      throw new Error(`Posts query failed: ${error.message}`)
    }

    console.log('✅ Server: Homepage posts fetched successfully:', posts?.length || 0)

    // Render posts for Vietnamese (default language)
    const renderedPosts = posts?.map((post) => {
      const translations = post.blog_post_translations || []
      const translation = translations.find(t => t.language_code === 'vi') || translations[0]

      if (!translation) {
        console.warn('⚠️ Server: No translation found for post:', post.id)
        return null
      }

      return (
        <BlogPostCard
          key={post.id}
          post={post}
          translation={translation}
          thumbnailUrl={getThumbnailUrl(post.thumbnail_url)}
          formatDate={(dateString: string) => formatDate(dateString, 'vi')}
          language="vi"
        />
      )
    }).filter(Boolean) || []

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        
        <HeroSection language="vi" />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bài viết mới nhất
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi
            </p>
          </div>

          {/* Blog Posts Grid */}
          {renderedPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {renderedPosts}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Không có bài viết nào được tìm thấy.
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    )

  } catch (error) {
    console.error('💥 Server: Homepage error:', error)
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        
        <HeroSection language="vi" />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bài viết mới nhất
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi
            </p>
          </div>

          {/* Error State */}
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    )
  }
}
