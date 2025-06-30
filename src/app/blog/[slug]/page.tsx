import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleDetailsClient from './ArticleDetailsClient'
import { ArrowLeft } from 'lucide-react'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
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
    const translation = translations?.find((t: any) => t.language_code === 'en') || translations?.[0]

    if (!translation) {
      console.error('❌ Blog Post: No translation found for post:', post.id)
      notFound()
    }

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

    // Fetch related posts
    let relatedPosts: any[] = []
    try {
      // First, try to find posts with shared tags
      if (tags.length > 0) {
        const tagIds = tagLinks.map((t: any) => t.tag_id)
        const { data: relatedByTags } = await supabase
          .from('blog_posts')
          .select(`
            id,
            slug,
            thumbnail_url,
            published_at,
            blog_post_translations!inner(title, summary, language_code)
          `)
          .eq('status', 'published')
          .neq('id', post.id)
          .in('blog_post_tags.tag_id', tagIds)
          .order('published_at', { ascending: false })
          .limit(6)

        if (relatedByTags && relatedByTags.length > 0) {
          relatedPosts = relatedByTags.map((p: any) => {
            const tr = p.blog_post_translations.find((t: any) => t.language_code === translation.language_code) || p.blog_post_translations[0]
            return {
              id: p.id,
              slug: p.slug,
              title: tr.title,
              summary: tr.summary,
              thumbnailUrl: p.thumbnail_url,
              publishedAt: p.published_at
            }
          })
        }
      }

      // If not enough posts by tags, fill with posts from same category
      if (relatedPosts.length < 6 && category) {
        const { data: relatedByCategory } = await supabase
          .from('blog_posts')
          .select(`
            id,
            slug,
            thumbnail_url,
            published_at,
            blog_post_translations!inner(title, summary, language_code)
          `)
          .eq('status', 'published')
          .eq('category_id', post.category_id)
          .neq('id', post.id)
          .not('id', 'in', `(${relatedPosts.map(p => p.id).join(',')})`)
          .order('published_at', { ascending: false })
          .limit(6 - relatedPosts.length)

        if (relatedByCategory && relatedByCategory.length > 0) {
          const categoryPosts = relatedByCategory.map((p: any) => {
            const tr = p.blog_post_translations.find((t: any) => t.language_code === translation.language_code) || p.blog_post_translations[0]
            return {
              id: p.id,
              slug: p.slug,
              title: tr.title,
              summary: tr.summary,
              thumbnailUrl: p.thumbnail_url,
              publishedAt: p.published_at
            }
          })
          relatedPosts = [...relatedPosts, ...categoryPosts]
        }
      }
    } catch (error) {
      console.error('❌ Blog Post: Error fetching related posts:', error)
      // Continue without related posts if there's an error
    }

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

          <ArticleDetailsClient
            postId={post.id}
            title={translation.title}
            content={translation.content}
            publishedAt={post.published_at}
            createdAt={post.created_at}
            viewCount={post.view_count || 0}
            category={category}
            tags={tags}
            thumbnailUrl={post.thumbnail_url}
            languageCode={translation.language_code}
            relatedPosts={relatedPosts}
          />
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('💥 Blog Post: Error fetching blog post:', error)
    notFound()
  }
} 