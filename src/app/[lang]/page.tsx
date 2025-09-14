import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HomepageClient } from '@/components/HomepageClient'
import { POSTS_PER_PAGE } from '@/lib/utils'
import { processTranslationsWithSummaries } from '@/lib/summary-generator'
import { logger } from '@/lib/logger'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  
  if (lang === 'vi') {
    return {
      title: 'Matt Dinh Blog',
      description: 'Blog cá nhân chia sẻ những hiểu biết về cuộc sống, công việc và kiến thức. Portfolio trưng bày các dự án IT và điểm nổi bật trong sự nghiệp.',
    }
  } else if (lang === 'en') {
    return {
      title: 'Matt Dinh Blog',
      description: 'Personal blog sharing insights about life, work, and knowledge. Portfolio showcasing IT projects and career highlights.',
    }
  }
  
  return {
    title: 'Matt Dinh Blog',
    description: 'Personal blog sharing insights about life, work, and knowledge. Portfolio showcasing IT projects and career highlights.',
  }
}

export default async function LanguageHomePage({ params }: Props) {
  const { lang } = await params
  
  // Validate language parameter
  if (lang !== 'vi' && lang !== 'en') {
    notFound()
  }

  try {
    logger.dbQuery('Fetching latest posts for language homepage', { 
      component: 'language-homepage',
      data: { language: lang } 
    })
    
    const supabase = await createServerSupabaseClient()
    
    // Fetch latest posts with translations (without categories for now)
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
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(POSTS_PER_PAGE)

    if (error) {
      logger.error('Language homepage posts query failed', { 
        component: 'language-homepage', 
        error,
        data: { language: lang, limit: POSTS_PER_PAGE } 
      })
      throw new Error(`Posts query failed: ${error.message}`)
    }

    logger.info('Language homepage posts fetched successfully', { 
      component: 'language-homepage',
      data: { language: lang, count: posts?.length || 0 } 
    })

    // Process posts to ensure they have summaries
    const processedPosts = posts?.map(post => ({
      ...post,
      blog_post_translations: processTranslationsWithSummaries(post.blog_post_translations || [])
    })) || []

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <HomepageClient posts={processedPosts} language={lang} />
        <Footer />
      </div>
    )

  } catch (error) {
    logger.error('Language homepage fatal error', { 
      component: 'language-homepage', 
      error: error instanceof Error ? error : new Error(String(error)),
      data: { language: lang }
    })
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <HomepageClient posts={[]} language={lang} />
        <Footer />
      </div>
    )
  }
}
