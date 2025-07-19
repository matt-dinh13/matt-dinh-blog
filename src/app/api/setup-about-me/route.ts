import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST() {
  try {
    console.log('🔧 Setting up about_me tables and data...')
    
    const supabase = await createServerSupabaseClient()
    
    // Create about_me table
    const { error: createAboutMeError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.about_me (
          id SERIAL PRIMARY KEY,
          status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
          author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
          published_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (createAboutMeError) {
      console.error('❌ Error creating about_me table:', createAboutMeError)
      return NextResponse.json({ error: 'Failed to create about_me table' }, { status: 500 })
    }

    // Create about_me_translations table
    const { error: createTranslationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.about_me_translations (
          id SERIAL PRIMARY KEY,
          about_me_id INTEGER REFERENCES public.about_me(id) ON DELETE CASCADE,
          language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
          title TEXT NOT NULL,
          subtitle TEXT,
          content TEXT NOT NULL,
          meta_title TEXT,
          meta_description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(about_me_id, language_code)
        );
      `
    })

    if (createTranslationsError) {
      console.error('❌ Error creating about_me_translations table:', createTranslationsError)
      return NextResponse.json({ error: 'Failed to create about_me_translations table' }, { status: 500 })
    }

    // Insert default about me record
    const { data: aboutMeData, error: insertAboutMeError } = await supabase
      .from('about_me')
      .insert([
        {
          status: 'published',
          published_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (insertAboutMeError && !insertAboutMeError.message.includes('duplicate key')) {
      console.error('❌ Error inserting about_me record:', insertAboutMeError)
      return NextResponse.json({ error: 'Failed to insert about_me record' }, { status: 500 })
    }

    // Get the about_me id (either newly created or existing)
    let aboutMeId = aboutMeData?.id
    if (!aboutMeId) {
      const { data: existingAboutMe } = await supabase
        .from('about_me')
        .select('id')
        .eq('status', 'published')
        .single()
      aboutMeId = existingAboutMe?.id
    }

    if (!aboutMeId) {
      return NextResponse.json({ error: 'Failed to get about_me id' }, { status: 500 })
    }

    // Insert English translation
    const { error: insertEnError } = await supabase
      .from('about_me_translations')
      .upsert([
        {
          about_me_id: aboutMeId,
          language_code: 'en',
          title: 'About Me',
          subtitle: 'Software Engineer & Business Analyst',
          content: `# About Me

Hello! I'm Matt Dinh, a passionate software engineer and business analyst with a love for creating meaningful solutions that bridge technology and business needs.

With over 5 years of experience in software development and business analysis, I specialize in building scalable web applications, analyzing business requirements, and translating complex problems into elegant technical solutions.

## Skills & Expertise

### Technical Skills
- JavaScript/TypeScript
- React/Next.js
- Node.js/Python
- PostgreSQL/MongoDB
- Docker/AWS

### Business Analysis
- Requirements Gathering
- Process Modeling
- Stakeholder Management
- Data Analysis
- Project Management

### Soft Skills
- Problem Solving
- Communication
- Team Leadership
- Critical Thinking
- Adaptability

## Professional Experience

### Senior Software Engineer
**Tech Solutions Inc.** | 2022 - Present

Leading development of enterprise web applications, mentoring junior developers, and collaborating with cross-functional teams.

## Education

### Bachelor of Computer Science
**University of Technology** | 2019

## Get In Touch

I'm always interested in new opportunities and collaborations. Feel free to reach out!

- **Email:** matt@example.com
- **LinkedIn:** [linkedin.com/in/mattdinh](https://linkedin.com/in/mattdinh)
- **GitHub:** [github.com/mattdinh](https://github.com/mattdinh)`,
          meta_title: 'About Me | Matt Dinh',
          meta_description: 'Learn more about Matt Dinh - software engineer, business analyst, and technology enthusiast.'
        }
      ])

    if (insertEnError) {
      console.error('❌ Error inserting English translation:', insertEnError)
      return NextResponse.json({ error: 'Failed to insert English translation' }, { status: 500 })
    }

    // Insert Vietnamese translation
    const { error: insertViError } = await supabase
      .from('about_me_translations')
      .upsert([
        {
          about_me_id: aboutMeId,
          language_code: 'vi',
          title: 'Về Tôi',
          subtitle: 'Kỹ Sư Phần Mềm & Phân Tích Viên Kinh Doanh',
          content: `# Về Tôi

Xin chào! Tôi là Matt Dinh, một kỹ sư phần mềm và phân tích viên kinh doanh đam mê, với tình yêu tạo ra những giải pháp có ý nghĩa kết nối công nghệ và nhu cầu kinh doanh.

Với hơn 5 năm kinh nghiệm trong phát triển phần mềm và phân tích kinh doanh, tôi chuyên về xây dựng các ứng dụng web có khả năng mở rộng, phân tích yêu cầu kinh doanh và chuyển đổi các vấn đề phức tạp thành các giải pháp kỹ thuật thanh lịch.

## Kỹ Năng & Chuyên Môn

### Kỹ Năng Kỹ Thuật
- JavaScript/TypeScript
- React/Next.js
- Node.js/Python
- PostgreSQL/MongoDB
- Docker/AWS

### Phân Tích Kinh Doanh
- Thu thập Yêu cầu
- Mô hình hóa Quy trình
- Quản lý Các bên liên quan
- Phân tích Dữ liệu
- Quản lý Dự án

### Kỹ Năng Mềm
- Giải quyết Vấn đề
- Giao tiếp
- Lãnh đạo Nhóm
- Tư duy Phản biện
- Thích ứng

## Kinh Nghiệm Chuyên Môn

### Kỹ Sư Phần Mềm Cao Cấp
**Tech Solutions Inc.** | 2022 - Hiện Tại

Lãnh đạo phát triển các ứng dụng web doanh nghiệp, hướng dẫn các lập trình viên trẻ và hợp tác với các nhóm đa chức năng.

## Học Vấn

### Cử Nhân Khoa Học Máy Tính
**Đại Học Công Nghệ** | 2019

## Liên Hệ

Tôi luôn quan tâm đến những cơ hội mới và sự hợp tác. Hãy liên hệ với tôi!

- **Email:** matt@example.com
- **LinkedIn:** [linkedin.com/in/mattdinh](https://linkedin.com/in/mattdinh)
- **GitHub:** [github.com/mattdinh](https://github.com/mattdinh)`,
          meta_title: 'Về Tôi | Matt Dinh',
          meta_description: 'Tìm hiểu thêm về Matt Dinh - kỹ sư phần mềm, phân tích viên kinh doanh và người đam mê công nghệ.'
        }
      ])

    if (insertViError) {
      console.error('❌ Error inserting Vietnamese translation:', insertViError)
      return NextResponse.json({ error: 'Failed to insert Vietnamese translation' }, { status: 500 })
    }

    console.log('✅ About me tables and data set up successfully!')
    
    return NextResponse.json({ 
      message: 'About me tables and data set up successfully',
      about_me_id: aboutMeId
    })
    
  } catch (error: any) {
    console.error('💥 Error setting up about me:', error)
    return NextResponse.json({ 
      error: 'Failed to set up about me',
      details: error.message 
    }, { status: 500 })
  }
} 