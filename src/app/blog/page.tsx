import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import BlogListClient from './BlogListClient'
import { logger } from '@/lib/logger'

export const metadata: Metadata = {
  title: 'Blog | Matt Dinh',
  description: 'Read my latest articles about software development, business analysis, and career insights.',
}

export default async function BlogListPage() {
  try {
    logger.dbQuery('Fetching blog posts for blog page', {
      component: 'BlogPage',
      data: { language: 'vi', limit: 10 }
    })
    
    const supabase = await createServerSupabaseClient()
    
    // Fetch blog posts with translations (Vietnamese by default)
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        thumbnail_url,
        published_at,
        created_at,
        view_count,
        blog_post_translations!inner(
          title,
          summary,
          content,
          language_code
        )
      `)
      .eq('status', 'published')
      .eq('blog_post_translations.language_code', 'vi')
      .order('published_at', { ascending: false })
      .limit(10)

    logger.dbQuery('Blog posts query completed', {
      component: 'BlogPage',
      data: { count: posts?.length || 0, hasError: !!error }
    })

    if (error) {
      logger.error('Error fetching blog posts', {
        component: 'BlogPage',
        error: error
      })
      return <BlogListClient initialPosts={[]} error={error.message} />
    }

    return <BlogListClient initialPosts={posts || []} />
    
  } catch (error: unknown) {
    logger.error('Unexpected error in blog page', {
      component: 'BlogPage',
      error: error instanceof Error ? error : new Error(String(error))
    })
    return <BlogListClient initialPosts={[]} error={error instanceof Error ? error.message : 'Unknown error'} />
  }
} 