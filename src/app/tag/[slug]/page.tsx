import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Metadata } from 'next'
import BlogCard from '@/components/BlogCard'
import { ArrowLeft } from 'lucide-react'

const CARD_TEXT_COLOR = { color: 'oklch(21% .034 264.665)' }
const PAGE_SIZE = 10

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const languageCode = resolvedSearchParams?.lang === 'vi' ? 'vi' : 'en'
  const supabase = createClient()
  const { data: tag } = await supabase
    .from('tags')
    .select('tag_translations(name, language_code)')
    .eq('slug', slug)
    .single()
  const tagName = tag?.tag_translations?.find((t: any) => t.language_code === languageCode)?.name || tag?.tag_translations?.[0]?.name || slug
  const title = languageCode === 'vi'
    ? `#${tagName} - Các bài viết liên quan | Matt Dinh Blog`
    : `#${tagName} - Related Articles | Matt Dinh Blog`
  const description = languageCode === 'vi'
    ? `Khám phá các bài viết liên quan đến hashtag #${tagName} trên blog của Matt Dinh.`
    : `Explore articles related to hashtag #${tagName} on Matt Dinh's blog.`
  const url = `https://mattdinh.com/tag/${slug}${languageCode === 'vi' ? '?lang=vi' : ''}`
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
  }
}

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string, page?: string }>
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const languageCode = resolvedSearchParams?.lang === 'vi' ? 'vi' : 'en'
  const page = parseInt(resolvedSearchParams?.page || '1', 10)
  const supabase = createClient()

  // Get tag info with translations
  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('id, tag_translations(name, language_code)')
    .eq('slug', slug)
    .single()

  if (tagError || !tag) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={CARD_TEXT_COLOR}>
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={CARD_TEXT_COLOR}>
          <Link href="/blog" className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
            <ArrowLeft size={16} />
            <span>{languageCode === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}</span>
          </Link>
          <div className="text-center text-red-600 dark:text-red-400 font-semibold">{languageCode === 'vi' ? 'Không tìm thấy hashtag.' : 'Tag not found.'}</div>
        </main>
        <Footer />
      </div>
    )
  }

  // Get paginated blog posts with this tag using a join
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data: postsData, count } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_post_translations!inner(*),
      blog_post_tags!inner(tag_id),
      categories(
        id, 
        slug, 
        category_translations(name, language_code)
      )
    `, { count: 'exact' })
    .eq('status', 'published')
    .eq('blog_post_tags.tag_id', tag.id)
    .order('published_at', { ascending: false })
    .range(from, to)

  // Get tag name in current language
  const tagName = tag.tag_translations?.find((t: any) => t.language_code === languageCode)?.name || tag.tag_translations?.[0]?.name || slug

  // Breadcrumbs localized
  const breadcrumbs = [
    { label: languageCode === 'vi' ? 'Trang chủ' : 'Home', href: '/' },
    { label: languageCode === 'vi' ? 'Blog' : 'Blog', href: '/blog' },
    { label: languageCode === 'vi' ? 'Hashtag' : 'Tag' },
    { label: `#${tagName}` }
  ]

  const hasMore = count ? from + PAGE_SIZE < count : false

  function getPageHref(nextPage: number) {
    const params = new URLSearchParams()
    if (languageCode === 'vi') params.set('lang', 'vi')
    params.set('page', String(nextPage))
    return `/tag/${slug}?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={CARD_TEXT_COLOR}>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={CARD_TEXT_COLOR}>
        <Breadcrumbs items={breadcrumbs} />
        <Link href="/blog" className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
          <ArrowLeft size={16} />
          <span>{languageCode === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}</span>
        </Link>
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-blue-400"># {tagName}</h1>
        {!postsData || postsData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">{languageCode === 'vi' ? 'Không có bài viết nào cho hashtag này.' : 'No articles found for this tag.'}</div>
        ) :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsData.map((post: any) => {
              const translation = post.blog_post_translations?.find((t: any) => t.language_code === languageCode) || post.blog_post_translations?.[0]
              const thumbnailUrl = post.thumbnail_url || '/cover.jpg'
              return (
                <BlogCard
                  key={post.id}
                  slug={post.slug}
                  title={translation?.title || post.slug}
                  description={translation?.summary || ''}
                  thumbnailUrl={thumbnailUrl}
                  publishedAt={post.published_at || post.created_at}
                  locale={languageCode === 'vi' ? 'vi-VN' : 'en-US'}
                />
              )
            })}
          </div>
        }
        {/* Pagination/Load More */}
        <div className="flex justify-center mt-8">
          {page > 1 && (
            <Link href={getPageHref(page - 1)} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-medium">
              {languageCode === 'vi' ? 'Trang trước' : 'Previous'}
            </Link>
          )}
          {hasMore && (
            <Link href={getPageHref(page + 1)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-medium">
              {languageCode === 'vi' ? 'Xem thêm' : 'Load More'}
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 