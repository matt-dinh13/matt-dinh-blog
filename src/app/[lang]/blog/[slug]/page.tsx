import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleDetailsClient from '../../../blog/[slug]/ArticleDetailsClient'
import { ArrowLeft } from 'lucide-react'
import Head from 'next/head'

const cardTextColor = { color: 'var(--foreground)' };

type Props = {
  params: Promise<{ slug: string, lang: string }>
}

export default async function LanguageBlogPostPage({ params }: Props) {
  const { slug, lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  
  try {
    console.log('🔍 Language Blog Post: Fetching post with slug:', slug, 'language:', language)
    
    const supabase = await createServerSupabaseClient()
    
    // Fetch post by slug regardless of status
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    console.log('📊 Language Blog Post: Post query result:', { data: post, error: postError })

    if (postError || !post) {
      console.error('❌ Language Blog Post: Post not found or error:', postError)
      notFound()
    }

    // If post is draft, check if user is admin
    if (post.status === 'draft') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        notFound()
      }
      // Fetch user from users table
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      if (!userData || !userData.is_admin) {
        notFound()
      }
    }

    // Fetch translations for this post
    const { data: translations, error: translationsError } = await supabase
      .from('blog_post_translations')
      .select('*')
      .eq('blog_post_id', post.id)

    console.log('📊 Language Blog Post: Translations query result:', { data: translations, error: translationsError })

    if (translationsError) {
      console.error('❌ Language Blog Post: Translations query failed:', translationsError)
      notFound()
    }

    // Find translation for current language
    const translation = translations?.find((t: any) => t.language_code === language)

    if (!translation) {
      // Show not available message
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
            <Breadcrumbs items={[
              { label: language === 'vi' ? 'Trang chủ' : 'Home', href: `/${language}` },
              { label: language === 'vi' ? 'Blog' : 'Blog', href: `/${language}/blog` },
            ]} />
            <div className="text-center text-red-600 dark:text-red-400 font-semibold my-12">
              {language === 'vi'
                ? 'Bài viết này chưa có bản dịch tiếng Việt.'
                : 'This article is not available in English.'}
            </div>
            <Link href={`/${language}/blog`} className="inline-flex items-center space-x-2 text-blue-600 hover:underline">
              <ArrowLeft size={16} />
              <span>{language === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}</span>
            </Link>
          </main>
          <Footer />
        </div>
      )
    }

    // Generate meta description
    function stripHtml(html: string) {
      if (!html) return '';
      return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }
    const metaTitle = translation.title || 'Matt Dinh Blog'
    const metaDescription = stripHtml(translation.content).slice(0, 160)

    // Fetch tags for this post
    const { data: tagLinks, error: tagLinksError } = await supabase
      .from('blog_post_tags')
      .select('tag_id')
      .eq('blog_post_id', post.id)

    let tags: { slug: string, name: string }[] = []
    if (!tagLinksError && Array.isArray(tagLinks) && tagLinks.length > 0) {
      const tagIds = tagLinks.map((t: any) => t.tag_id)
      // Fetch tag slugs and names (current language)
      const { data: tagData, error: tagDataError } = await supabase
        .from('tags')
        .select('id, slug, tag_translations(name, language_code)')
        .in('id', tagIds)

      if (!tagDataError && tagData) {
        tags = tagData.map((tag: any) => {
          const tr = tag.tag_translations.find((t: any) => t.language_code === translation.language_code) || tag.tag_translations[0]
          return {
            slug: tag.slug,
            name: tr?.name || tag.slug
          }
        })
      }
    }

    // Fetch category for this post (with translation)
    let category = null
    if (post.category_id) {
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('slug, category_translations(name, language_code)')
        .eq('id', post.category_id)
        .single()
      if (!catError && catData) {
        const tr = catData.category_translations.find((t: any) => t.language_code === translation.language_code) || catData.category_translations[0]
        category = {
          slug: catData.slug,
          name: tr?.name || catData.slug
        }
      }
    }

    // Fetch related posts
    let relatedPosts: any[] = []
    try {
      // First, try to find posts with shared tags
      if (tags.length > 0) {
        const tagIds = Array.isArray(tagLinks) ? tagLinks.map((t: any) => t.tag_id) : []
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
      console.error('❌ Language Blog Post: Error fetching related posts:', error)
      // Continue without related posts if there's an error
    }

    return (
      <>
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          {/* Hreflang tags for language versions */}
          {translations?.map((t: any) => (
            <link 
              key={t.language_code}
              rel="alternate" 
              hrefLang={t.language_code} 
              href={`/${t.language_code}/blog/${post.slug}`}
            />
          ))}
          {/* Default hreflang */}
          <link rel="alternate" hrefLang="x-default" href={`/vi/blog/${post.slug}`} />
        </Head>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
            <Breadcrumbs items={[
              { label: language === 'vi' ? 'Trang chủ' : 'Home', href: `/${language}` },
              { label: language === 'vi' ? 'Blog' : 'Blog', href: `/${language}/blog` },
              { label: translation.title }
            ]} />
            {/* Back Button and Draft Badge Row */}
            <div className="flex items-center justify-between mb-8">
            <Link 
              href={`/${language}/blog`}
                className="inline-flex items-center space-x-2 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300"
            >
              <ArrowLeft size={16} />
              <span>{language === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}</span>
            </Link>
              {post.status === 'draft' && (
                <div className="inline-block px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full font-semibold text-xs">Draft (visible to admin only)</div>
              )}
            </div>
            <ArticleDetailsClient
              postId={post.id}
              title={translation.title}
              content={translation.content}
              publishedAt={post.published_at}
              createdAt={post.created_at}
              viewCount={post.view_count}
              category={category}
              tags={tags}
              thumbnailUrl={post.thumbnail_url}
              languageCode={translation.language_code}
              relatedPosts={relatedPosts}
            />
          </main>
          <Footer />
        </div>
      </>
    )
  } catch (error) {
    console.error('💥 Language Blog Post: Error fetching blog post:', error)
    notFound()
  }
} 