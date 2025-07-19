import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('🔍 API: Testing blog posts fetch...')
    
    const supabase = await createServerSupabaseClient()
    
    // Test simple query first
    const { data: testPosts, error: testError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .limit(5)

    console.log('🔍 API: Test query result:', { 
      data: testPosts, 
      error: testError, 
      count: testPosts?.length || 0 
    })

    if (testError) {
      console.error('❌ API: Test query failed:', testError)
      return NextResponse.json({ 
        error: 'Database query failed', 
        details: testError.message 
      }, { status: 500 })
    }

    if (!testPosts || testPosts.length === 0) {
      console.log('⚠️ API: No published posts found')
      return NextResponse.json({ 
        message: 'No blog posts found',
        posts: [],
        count: 0
      })
    }

    // Now get full data with translations
    const { data: postsWithTranslations, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_translations(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10)

    console.log('🔍 API: Full query result:', { 
      data: postsWithTranslations, 
      error: postsError, 
      count: postsWithTranslations?.length || 0 
    })

    if (postsError) {
      console.error('❌ API: Full query failed:', postsError)
      return NextResponse.json({ 
        error: 'Full query failed', 
        details: postsError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Blog posts fetched successfully',
      posts: postsWithTranslations,
      count: postsWithTranslations?.length || 0
    })

  } catch (error: any) {
    console.error('💥 API: Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error.message 
    }, { status: 500 })
  }
} 