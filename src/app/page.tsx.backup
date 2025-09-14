import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HomepageClient } from '@/components/HomepageClient'
import { POSTS_PER_PAGE } from '@/lib/utils'
import { processTranslationsWithSummaries } from '@/lib/summary-generator'
import { logger } from '@/lib/logger'

export const metadata: Metadata = {
  title: 'Matt Dinh Blog',
  description: 'Personal blog sharing insights about life, work, and knowledge. Portfolio showcasing IT projects and career highlights.',
}

// Types are defined inline where needed

export default async function Home() {
  try {
    logger.dbQuery('Fetching latest posts for homepage')
    
    const supabase = await createServerSupabaseClient()
    
    // Fetch latest posts with translations for all languages
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
      logger.error('Homepage posts query failed', { 
        component: 'homepage', 
        error,
        data: { limit: POSTS_PER_PAGE } 
      })
      throw new Error(`Posts query failed: ${error.message}`)
    }

    logger.info('Homepage posts fetched successfully', { 
      component: 'homepage',
      data: { count: posts?.length || 0 } 
    })

    // Process posts to ensure they have summaries
    const processedPosts = posts?.map(post => ({
      ...post,
      blog_post_translations: processTranslationsWithSummaries(post.blog_post_translations || [])
    })) || []

    // Pass posts to client component for language-aware rendering

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <HomepageClient posts={processedPosts} />
        <Footer />
      </div>
    )

  } catch (error) {
    logger.error('Homepage fatal error', { 
      component: 'homepage', 
      error: error instanceof Error ? error : new Error(String(error))
    })
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <HomepageClient posts={[]} />
        <Footer />
      </div>
    )
  }
}
