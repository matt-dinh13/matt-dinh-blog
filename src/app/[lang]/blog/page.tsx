import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { BlogPostCard } from '@/components/BlogPostCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

const CARD_TEXT_COLOR = { color: 'oklch(21% .034 264.665)' }
const PAGE_SIZE = 9

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  
  const title = language === 'vi' 
    ? 'Blog - Matt Dinh Blog'
    : 'Blog - Matt Dinh Blog'
  
  const description = language === 'vi'
    ? 'Khám phá các bài viết về công nghệ, cuộc sống và những trải nghiệm thú vị từ hành trình của Matt Dinh.'
    : 'Explore articles about technology, life, and interesting experiences from Matt Dinh\'s journey.'
  
  const url = `https://mattdinh.com/${language}/blog`
  
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
        'vi': 'https://mattdinh.com/vi/blog',
        'en': 'https://mattdinh.com/en/blog',
        'x-default': 'https://mattdinh.com/vi/blog'
      }
    }
  }
}

interface Props {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function LanguageBlogPage({ params, searchParams }: Props) {
  const { lang } = await params
  const resolvedSearchParams = await searchParams
  const language = lang === 'en' ? 'en' : 'vi'
  const page = parseInt(resolvedSearchParams?.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  
  const supabase = createClient()
  
  // Fetch published posts with translations in current language
  const { data: posts, error, count } = await supabase
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
    `, { count: 'exact' })
    .eq('status', 'published')
    .eq('blog_post_translations.language_code', language)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const postsData = posts || []
  const totalPosts = count || 0
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE)
  const hasMore = page < totalPages

  // Content based on language
  const content = {
    vi: {
      title: 'Blog',
      subtitle: 'Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi',
      noPosts: 'Chưa có bài viết nào.',
      loadMore: 'Xem thêm bài viết',
      backToHome: 'Quay lại trang chủ'
    },
    en: {
      title: 'Blog',
      subtitle: 'Discover insights, experiences, and knowledge from my journey',
      noPosts: 'No articles yet.',
      loadMore: 'Load More Articles',
      backToHome: 'Back to Home'
    }
  }

  const text = content[language as keyof typeof content]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={CARD_TEXT_COLOR}>
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/${language}`} 
            className="inline-flex items-center space-x-2 mb-4 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300"
          >
            <ArrowRight className="rotate-180 h-4 w-4" />
            <span>{text.backToHome}</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {text.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {text.subtitle}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {postsData.length > 0 ? (
          <>
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

            {/* Pagination */}
            {hasMore && (
              <div className="text-center mt-12">
                <Link
                  href={`/${language}/blog?page=${page + 1}`}
                  className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
                >
                  {text.loadMore}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {text.noPosts}
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
} 