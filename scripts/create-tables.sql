-- Create Database Tables for Matt Dinh Blog
-- Run this in your Supabase SQL Editor to create all required tables

-- 1. Create languages table
CREATE TABLE IF NOT EXISTS public.languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create blog_post_translations table
CREATE TABLE IF NOT EXISTS public.blog_post_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_post_id, language_code)
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_language ON public.blog_post_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_post_id ON public.blog_post_translations(blog_post_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for public read access
CREATE POLICY "Allow public read access to languages" ON public.languages
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read access to blog post translations" ON public.blog_post_translations
    FOR SELECT USING (true);

-- 7. Insert default languages
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES 
    ('en', 'English', 'English', true),
    ('vi', 'Vietnamese', 'Tiếng Việt', false)
ON CONFLICT (code) DO NOTHING;

-- 8. Insert sample blog posts
INSERT INTO public.blog_posts (slug, status, published_at) 
VALUES 
    ('welcome-to-my-blog', 'published', NOW()),
    ('getting-started-with-nextjs', 'published', NOW()),
    ('building-scalable-applications', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 9. Insert sample translations
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
    -- English translations
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'welcome-to-my-blog'), 
        'en', 
        'Welcome to My Blog', 
        'This is a test post to verify that your blog is working correctly.',
        '<h1>Welcome to My Blog</h1><p>This is a test post to verify that your blog is working correctly. If you can see this post, it means your Supabase connection is working!</p><h2>What next?</h2><p>You can now add more posts through the admin panel or directly in the database.</p>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'getting-started-with-nextjs'), 
        'en', 
        'Getting Started with Next.js', 
        'Learn how to build modern web applications with Next.js and Supabase.',
        '<h1>Getting Started with Next.js</h1><p>Next.js is a powerful React framework that makes building full-stack web applications simple and efficient.</p><h2>Why Next.js?</h2><ul><li>Server-side rendering</li><li>Static site generation</li><li>API routes</li><li>Excellent developer experience</li></ul>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-applications'), 
        'en', 
        'Building Scalable Applications', 
        'Best practices for building applications that can grow with your business.',
        '<h1>Building Scalable Applications</h1><p>Scalability is crucial for any application that aims to grow. Here are some key principles to follow.</p><h2>Key Principles</h2><ul><li>Modular architecture</li><li>Database optimization</li><li>Caching strategies</li><li>Load balancing</li></ul>'
    ),
    -- Vietnamese translations
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'welcome-to-my-blog'), 
        'vi', 
        'Chào mừng đến với Blog của tôi', 
        'Đây là bài viết thử nghiệm để kiểm tra xem blog của bạn có hoạt động đúng không.',
        '<h1>Chào mừng đến với Blog của tôi</h1><p>Đây là bài viết thử nghiệm để kiểm tra xem blog của bạn có hoạt động đúng không. Nếu bạn có thể thấy bài viết này, điều đó có nghĩa là kết nối Supabase của bạn đang hoạt động!</p><h2>Tiếp theo là gì?</h2><p>Bây giờ bạn có thể thêm nhiều bài viết hơn thông qua bảng quản trị hoặc trực tiếp trong cơ sở dữ liệu.</p>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'getting-started-with-nextjs'), 
        'vi', 
        'Bắt đầu với Next.js', 
        'Học cách xây dựng ứng dụng web hiện đại với Next.js và Supabase.',
        '<h1>Bắt đầu với Next.js</h1><p>Next.js là một framework React mạnh mẽ giúp việc xây dựng ứng dụng web full-stack trở nên đơn giản và hiệu quả.</p><h2>Tại sao Next.js?</h2><ul><li>Server-side rendering</li><li>Static site generation</li><li>API routes</li><li>Trải nghiệm phát triển tuyệt vời</li></ul>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-applications'), 
        'vi', 
        'Xây dựng Ứng dụng Có thể Mở rộng', 
        'Các phương pháp tốt nhất để xây dựng ứng dụng có thể phát triển cùng với doanh nghiệp của bạn.',
        '<h1>Xây dựng Ứng dụng Có thể Mở rộng</h1><p>Khả năng mở rộng là rất quan trọng đối với bất kỳ ứng dụng nào nhằm phát triển. Dưới đây là một số nguyên tắc chính cần tuân theo.</p><h2>Nguyên tắc Chính</h2><ul><li>Kiến trúc mô-đun</li><li>Tối ưu hóa cơ sở dữ liệu</li><li>Chiến lược cache</li><li>Cân bằng tải</li></ul>'
    )
ON CONFLICT (blog_post_id, language_code) DO NOTHING;

-- 10. Verify the setup
SELECT 'Setup complete! Here is what was created:' as message;
SELECT 'Languages:' as table_name, COUNT(*) as count FROM public.languages;
SELECT 'Blog Posts:' as table_name, COUNT(*) as count FROM public.blog_posts;
SELECT 'Translations:' as table_name, COUNT(*) as count FROM public.blog_post_translations; 