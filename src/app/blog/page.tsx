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
    
    // Fetch blog posts with translations
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_translations(*)
      `)
      .eq('status', 'published')
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