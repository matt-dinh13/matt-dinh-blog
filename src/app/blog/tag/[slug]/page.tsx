import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const supabase = createClient()

  // Get tag info
  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('id, tag_translations(name)')
    .eq('slug', slug)
    .single()

  if (tagError || !tag) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
          <Link href="/blog" className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>
          <div className="text-center text-red-600 dark:text-red-400 font-semibold">Tag not found.</div>
        </main>
        <Footer />
      </div>
    )
  }

  // Get all blog post IDs with this tag
  const { data: postTags } = await supabase
    .from('blog_post_tags')
    .select('blog_post_id')
    .eq('tag_id', tag.id)

  const postIds = postTags?.map((pt: any) => pt.blog_post_id) || []

  // Fetch posts and their translations
  let posts: any[] = []
  if (postIds.length > 0) {
    const { data: postsData } = await supabase
      .from('blog_posts')
      .select('*')
      .in('id', postIds)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    // Fetch translations
    const { data: translationsData } = await supabase
      .from('blog_post_translations')
      .select('*')
      .in('blog_post_id', postIds)

    // Combine posts with their translations
    posts = (postsData || []).map((post: any) => ({
      ...post,
      translations: translationsData?.filter((t: any) => t.blog_post_id === post.id) || []
    }))
  }

  // Get tag name (English for now)
  const tagName = tag.tag_translations?.[0]?.name || slug

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Tag' },
          { label: tagName }
        ]} />
        <Link href="/blog" className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
          <ArrowLeft size={16} />
          <span>Back to Blog</span>
        </Link>
        <h1 className="text-3xl font-bold mb-8"># {tagName}</h1>
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No articles found for this tag.</div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => {
              const translation = post.translations.find((t: any) => t.language_code === 'en') || post.translations[0]
              const thumbnailUrl = post.thumbnail_url || '/cover.jpg'
              return (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Link href={`/blog/${post.slug}`} className="block relative h-48 md:h-full bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                        <Image
                          src={thumbnailUrl}
                          alt={translation?.title || post.slug}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </Link>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <header className="mb-4">
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                            {translation?.title || post.slug}
                          </Link>
                        </h2>
                        <p className="text-lg mb-4 text-gray-600 dark:text-gray-400">
                          {translation?.summary}
                        </p>
                      </header>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                          <span>Read more</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
} 