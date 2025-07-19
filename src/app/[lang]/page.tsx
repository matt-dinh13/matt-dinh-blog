import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { BlogPostCard } from '@/components/BlogPostCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

// Removed unused constant
const PAGE_SIZE = 6

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  
  const title = language === 'vi' 
    ? 'Matt Dinh Blog - Chia sẻ kiến thức và trải nghiệm'
    : 'Matt Dinh Blog - Sharing Knowledge and Experiences'
  
  const description = language === 'vi'
    ? 'Khám phá các bài viết về công nghệ, cuộc sống và những trải nghiệm thú vị từ hành trình của Matt Dinh.'
    : 'Explore articles about technology, life, and interesting experiences from Matt Dinh\'s journey.'
  
  const url = `https://mattdinh.com/${language}`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        'vi': 'https://mattdinh.com/vi',
        'en': 'https://mattdinh.com/en',
        'x-default': 'https://mattdinh.com/vi'
      }
    }
  }
}

interface Props {
  params: Promise<{ lang: string }>
}

export default async function LanguageHomePage({ params }: Props) {
  const { lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  
  const supabase = createClient()
  
  // Fetch latest published posts with translations in current language
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug,
      thumbnail_url,
      published_at,
      view_count,
      blog_post_translations!inner(
        title,
        summary,
        language_code
      ),
      categories(
        category_translations(name, language_code)
      )
    `)
    .eq('status', 'published')
    .eq('blog_post_translations.language_code', language)
    .order('published_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const postsData = posts || []

  // Hero section content based on language
  const heroContent = {
    vi: {
      title: 'Chào mừng đến với Blog của Matt Dinh',
      subtitle: 'Chia sẻ kiến thức, trải nghiệm và những câu chuyện thú vị từ hành trình của tôi',
      cta: 'Khám phá bài viết',
      latestPosts: 'Bài viết mới nhất',
      latestPostsSubtitle: 'Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi'
    },
    en: {
      title: 'Welcome to Matt Dinh\'s Blog',
      subtitle: 'Sharing knowledge, experiences, and interesting stories from my journey',
      cta: 'Explore Articles',
      latestPosts: 'Latest Articles',
      latestPostsSubtitle: 'Discover insights, experiences, and knowledge from my journey'
    }
  }

  const content = heroContent[language as keyof typeof heroContent]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
          <Link
            href={`/${language}/blog`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {content.cta}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {content.latestPosts}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {content.latestPostsSubtitle}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {postsData.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {postsData.map((post: any) => {
              // Find the correct translation for the current language
              const translation = post.blog_post_translations?.find(
                (t: any) => t.language_code === language
              ) || post.blog_post_translations?.[0]

              return (
                <BlogPostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    slug: post.slug,
                    thumbnail_url: post.thumbnail_url,
                    published_at: post.published_at,
                    created_at: post.created_at
                  }}
                  translation={{
                    language_code: language,
                    title: translation?.title || '',
                    summary: translation?.summary || '',
                    content: translation?.content || ''
                  }}
                  thumbnailUrl={post.thumbnail_url || '/cover.jpg'}
                  formatDate={(dateString: string) => {
                    const date = new Date(dateString)
                    return language === 'vi' 
                      ? date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })
                      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  }}
                  language={language}
                />
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'vi' ? 'Chưa có bài viết nào.' : 'No articles yet.'}
            </p>
          </div>
        )}

        {/* View All Posts Button */}
        {postsData.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href={`/${language}/blog`}
              className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
            >
              {language === 'vi' ? 'Xem tất cả bài viết' : 'View All Articles'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
} 