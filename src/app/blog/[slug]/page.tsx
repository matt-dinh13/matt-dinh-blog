import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AdminPostMetaClient from './AdminPostMetaClient'
import Breadcrumbs from '@/components/Breadcrumbs'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  try {
    console.log('🔍 Blog Post: Fetching post with slug:', slug)
    
    const supabase = createClient()
    
    // First, fetch the blog post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    console.log('📊 Blog Post: Post query result:', { data: post, error: postError })

    if (postError || !post) {
      console.error('❌ Blog Post: Post not found or error:', postError)
      notFound()
    }

    // Then, fetch the translations for this post
    const { data: translations, error: translationsError } = await supabase
      .from('blog_post_translations')
      .select('*')
      .eq('blog_post_id', post.id)

    console.log('📊 Blog Post: Translations query result:', { data: translations, error: translationsError })

    if (translationsError) {
      console.error('❌ Blog Post: Translations query failed:', translationsError)
      notFound()
    }

    // For now, we'll use English content (you can add language detection later)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translation = translations?.find((t: any) => t.language_code === 'en') || translations?.[0]

    if (!translation) {
      console.error('❌ Blog Post: No translation found for post:', post.id)
      notFound()
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Add custom style for headings in the article content
    const proseStyle = `
      h1, h2, h3, h4, h5, h6 {
        color: oklch(21% .034 264.665) !important;
        font-family: Inter, system-ui, sans-serif !important;
        font-weight: 500 !important;
      }
      p, ul, ol, li {
        font-family: Inter, system-ui, sans-serif !important;
      }
    `;

    // Fetch tags for this post
    const { data: tagLinks, error: tagLinksError } = await supabase
      .from('blog_post_tags')
      .select('tag_id')
      .eq('blog_post_id', post.id)

    let tags: { slug: string, name: string }[] = []
    if (!tagLinksError && tagLinks && tagLinks.length > 0) {
      const tagIds = tagLinks.map((t: any) => t.tag_id)
      // Fetch tag slugs and names (English for now)
      const { data: tagData, error: tagDataError } = await supabase
        .from('tags')
        .select('id, slug, tag_translations(name)')
        .in('id', tagIds)

      if (!tagDataError && tagData) {
        tags = tagData.map((tag: any) => ({
          slug: tag.slug,
          name: tag.tag_translations?.[0]?.name || tag.slug
        }))
      }
    }

    // Fetch category for this post (with translation)
    let category = null
    if (post.category_id) {
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('slug, category_translations(name)')
        .eq('id', post.category_id)
        .single()
      if (!catError && catData) {
        category = {
          slug: catData.slug,
          name: catData.category_translations?.[0]?.name || catData.slug
        }
      }
    }

    console.log('✅ Blog Post: Successfully fetched post and translation')

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: translation.title }
          ]} />
          {/* Back Button */}
          <Link 
            href="/blog"
            className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>

          {/* Article Card */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" style={cardTextColor}>
            <div className="p-8">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {category ? (
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 mr-2"
                    >
                      {category.name}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Blog Post
                    </span>
                  )}
                  <AdminPostMetaClient id={post.id} status={post.status} />
                </div>
                
                <h1 className="text-3xl font-bold mb-4" style={cardTextColor}>
                  {translation.title}
                </h1>
                
                <p className="text-lg mb-6" style={cardTextColor}>
                  {translation.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm" style={cardTextColor}>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <style>{proseStyle}</style>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                style={cardTextColor}
                dangerouslySetInnerHTML={{ __html: translation.content }}
              />
              {/* Hashtag Section */}
              {tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/blog/tag/${tag.slug}`}
                      className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-white transition-colors duration-200"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('💥 Blog Post: Error fetching blog post:', error)
    notFound()
  }
} 