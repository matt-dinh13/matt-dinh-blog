import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog | Matt Dinh',
  description: 'Read my latest articles about software development, business analysis, and career insights.',
}

export default async function BlogListPage() {
  try {
    console.log('🔍 Server: Fetching blog posts...')
    
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

    console.log('🔍 Server: Posts fetched:', { 
      count: posts?.length || 0, 
      error: error?.message 
    })

    if (error) {
      console.error('❌ Server: Error fetching posts:', error)
      return <BlogListClient initialPosts={[]} error={error.message} />
    }

    return <BlogListClient initialPosts={posts || []} />
    
  } catch (error: any) {
    console.error('💥 Server: Unexpected error:', error)
    return <BlogListClient initialPosts={[]} error={error.message} />
  }
} 