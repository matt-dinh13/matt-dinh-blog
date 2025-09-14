import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

interface Translation {
  blog_post_id: number
  language_code: string
  title: string
  summary: string
  content: string
}

export async function POST() {
  try {
    const supabase = createAdminSupabaseClient()
    
    // First, let's check if we have an admin user
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'admin@mattdinh.com')
      .limit(1)

    if (usersError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to check users',
        details: usersError
      })
    }

    let adminUserId = users?.[0]?.id

    // Create admin user if it doesn't exist
    if (!adminUserId) {
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email: 'admin@mattdinh.com',
          full_name: 'Matt Dinh',
          role: 'admin'
        })
        .select('id')
        .single()

      if (createUserError) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create admin user',
          details: createUserError
        })
      }

      adminUserId = newUser.id
    }

    // Create sample blog posts
    const samplePosts = [
      {
        slug: 'welcome-to-matt-dinh-blog',
        status: 'published',
        author_id: adminUserId,
        thumbnail_url: '/covers/cover-home.jpg',
        published_at: new Date().toISOString()
      },
      {
        slug: 'building-modern-web-applications',
        status: 'published',
        author_id: adminUserId,
        thumbnail_url: '/covers/cover-home.jpg',
        published_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        slug: 'the-journey-of-a-developer',
        status: 'published',
        author_id: adminUserId,
        thumbnail_url: '/covers/cover-home.jpg',
        published_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ]

    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .insert(samplePosts)
      .select('id, slug')

    if (postsError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create blog posts',
        details: postsError
      })
    }

    // Create translations for each post
    const translations: Translation[] = []
    posts.forEach((post, index) => {
      const titles = [
        ['Welcome to Matt Dinh Blog', 'Chào mừng đến với Blog Matt Dinh'],
        ['Building Modern Web Applications', 'Xây dựng Ứng dụng Web Hiện đại'],
        ['The Journey of a Developer', 'Hành trình của một Developer']
      ]

      const contents = [
        [
          'Welcome to my personal blog where I share insights about technology, development, and life.',
          'Chào mừng đến với blog cá nhân của tôi, nơi tôi chia sẻ những hiểu biết về công nghệ, phát triển và cuộc sống.'
        ],
        [
          'Modern web applications require careful planning, robust architecture, and attention to user experience.',
          'Các ứng dụng web hiện đại đòi hỏi sự lập kế hoạch cẩn thận, kiến trúc mạnh mẽ và chú ý đến trải nghiệm người dùng.'
        ],
        [
          'Every developer has a unique journey filled with challenges, learning, and growth.',
          'Mỗi developer đều có một hành trình riêng biệt đầy thử thách, học hỏi và phát triển.'
        ]
      ]

      // English translation
      translations.push({
        blog_post_id: post.id,
        language_code: 'en',
        title: titles[index][0],
        summary: contents[index][0],
        content: `<h1>${titles[index][0]}</h1><p>${contents[index][0]}</p>`
      })

      // Vietnamese translation
      translations.push({
        blog_post_id: post.id,
        language_code: 'vi',
        title: titles[index][1],
        summary: contents[index][1],
        content: `<h1>${titles[index][1]}</h1><p>${contents[index][1]}</p>`
      })
    })

    const { error: translationsError } = await supabase
      .from('blog_post_translations')
      .insert(translations)

    if (translationsError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create translations',
        details: translationsError
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Production content created successfully',
      data: {
        adminUserId,
        postsCreated: posts.length,
        translationsCreated: translations.length
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    })
  }
}
