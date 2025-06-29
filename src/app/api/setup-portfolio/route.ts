import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()

    // Add sample portfolio projects
    const { data: projects, error: projectsError } = await supabase
      .from('portfolio_projects')
      .insert([
        {
          slug: 'e-commerce-platform',
          thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
          project_url: 'https://example-ecommerce.com',
          github_url: 'https://github.com/username/ecommerce-platform',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
          status: 'published',
          published_at: new Date().toISOString()
        },
        {
          slug: 'task-management-app',
          thumbnail_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
          project_url: 'https://example-taskapp.com',
          github_url: 'https://github.com/username/task-management',
          technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
          status: 'published',
          published_at: new Date().toISOString()
        },
        {
          slug: 'weather-dashboard',
          thumbnail_url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop',
          project_url: 'https://example-weather.com',
          github_url: 'https://github.com/username/weather-dashboard',
          technologies: ['React', 'TypeScript', 'OpenWeather API', 'Chart.js'],
          status: 'published',
          published_at: new Date().toISOString()
        }
      ])
      .select()

    if (projectsError) {
      console.error('Error inserting projects:', projectsError)
      return NextResponse.json({ error: projectsError.message }, { status: 500 })
    }

    // Get the inserted project IDs
    const projectIds = projects?.map((p: any) => p.id) || []

    // Add English translations
    const englishTranslations = [
      {
        portfolio_project_id: projectIds[0],
        language_code: 'en',
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform with payment processing, inventory management, and admin dashboard.',
        content: '<h1>E-Commerce Platform</h1><p>A comprehensive e-commerce solution built with modern web technologies.</p>'
      },
      {
        portfolio_project_id: projectIds[1],
        language_code: 'en',
        title: 'Task Management Application',
        description: 'Real-time task management application with team collaboration features and progress tracking.',
        content: '<h1>Task Management Application</h1><p>A collaborative task management platform for teams.</p>'
      },
      {
        portfolio_project_id: projectIds[2],
        language_code: 'en',
        title: 'Weather Dashboard',
        description: 'Interactive weather dashboard with location-based forecasts and historical data visualization.',
        content: '<h1>Weather Dashboard</h1><p>An interactive weather application with detailed forecasts.</p>'
      }
    ]

    const { error: enError } = await supabase
      .from('portfolio_project_translations')
      .insert(englishTranslations)

    if (enError) {
      console.error('Error inserting English translations:', enError)
      return NextResponse.json({ error: enError.message }, { status: 500 })
    }

    // Add Vietnamese translations
    const vietnameseTranslations = [
      {
        portfolio_project_id: projectIds[0],
        language_code: 'vi',
        title: 'Nền Tảng Thương Mại Điện Tử',
        description: 'Nền tảng thương mại điện tử đầy đủ với xử lý thanh toán, quản lý kho hàng và bảng điều khiển quản trị.',
        content: '<h1>Nền Tảng Thương Mại Điện Tử</h1><p>Giải pháp thương mại điện tử toàn diện được xây dựng với các công nghệ web hiện đại.</p>'
      },
      {
        portfolio_project_id: projectIds[1],
        language_code: 'vi',
        title: 'Ứng Dụng Quản Lý Công Việc',
        description: 'Ứng dụng quản lý công việc thời gian thực với tính năng cộng tác nhóm và theo dõi tiến độ.',
        content: '<h1>Ứng Dụng Quản Lý Công Việc</h1><p>Nền tảng quản lý công việc cộng tác cho các nhóm.</p>'
      },
      {
        portfolio_project_id: projectIds[2],
        language_code: 'vi',
        title: 'Bảng Điều Khiển Thời Tiết',
        description: 'Bảng điều khiển thời tiết tương tác với dự báo dựa trên vị trí và trực quan hóa dữ liệu lịch sử.',
        content: '<h1>Bảng Điều Khiển Thời Tiết</h1><p>Ứng dụng thời tiết tương tác với dự báo chi tiết.</p>'
      }
    ]

    const { error: viError } = await supabase
      .from('portfolio_project_translations')
      .insert(vietnameseTranslations)

    if (viError) {
      console.error('Error inserting Vietnamese translations:', viError)
      return NextResponse.json({ error: viError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio data setup completed',
      projects: projectIds.length
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 