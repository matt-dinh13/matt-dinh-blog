import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HomepageClient } from '@/components/HomepageClient'
import { POSTS_PER_PAGE } from '@/lib/utils'
import { processTranslationsWithSummaries } from '@/lib/summary-generator'

export const metadata: Metadata = {
  title: 'Matt Dinh Blog',
  description: 'Personal blog sharing insights about life, work, and knowledge. Portfolio showcasing IT projects and career highlights.',
}

// Types are defined inline where needed

export default async function Home() {
  try {
    console.log('🔍 Server: Fetching latest posts for homepage...')
    
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
      console.error('❌ Server: Homepage posts query failed:', error)
      throw new Error(`Posts query failed: ${error.message}`)
    }

    console.log('✅ Server: Homepage posts fetched successfully:', posts?.length || 0)

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
    console.error('💥 Server: Homepage error:', error)
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <HomepageClient posts={[]} />
        <Footer />
      </div>
    )
  }
}
