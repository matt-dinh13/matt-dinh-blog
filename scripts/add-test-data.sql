-- Add Test Data to Existing Tables
-- Run this in your Supabase SQL Editor to add sample data

-- 1. Add languages if they don't exist
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES 
    ('en', 'English', 'English', true),
    ('vi', 'Vietnamese', 'Tiếng Việt', false)
ON CONFLICT (code) DO NOTHING;

-- 2. Add sample blog posts
INSERT INTO public.blog_posts (slug, status, published_at) 
VALUES 
    ('welcome-to-my-blog', 'published', NOW()),
    ('getting-started-with-nextjs', 'published', NOW()),
    ('building-scalable-applications', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 3. Add sample translations
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
    -- English translations
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'welcome-to-my-blog'), 
        'en', 
        'Welcome to My Blog', 
        'This is a test post to verify that your blog is working correctly.',
        '<h1>Welcome to My Blog</h1><p>This is a test post to verify that your blog is working correctly.</p>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'getting-started-with-nextjs'), 
        'en', 
        'Getting Started with Next.js', 
        'Learn how to build modern web applications with Next.js and Supabase.',
        '<h1>Getting Started with Next.js</h1><p>Next.js is a powerful React framework.</p>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-applications'), 
        'en', 
        'Building Scalable Applications', 
        'Best practices for building applications that can grow with your business.',
        '<h1>Building Scalable Applications</h1><p>Scalability is crucial for any application.</p>'
    ),
    -- Vietnamese translations
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'welcome-to-my-blog'), 
        'vi', 
        'Chào mừng đến với Blog của tôi', 
        'Đây là bài viết thử nghiệm để kiểm tra xem blog của bạn có hoạt động đúng không.',
        '<h1>Chào mừng đến với Blog của tôi</h1><p>Đây là bài viết thử nghiệm.</p>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'getting-started-with-nextjs'), 
        'vi', 
        'Bắt đầu với Next.js', 
        'Học cách xây dựng ứng dụng web hiện đại với Next.js và Supabase.',
        '<h1>Bắt đầu với Next.js</h1><p>Next.js là một framework React mạnh mẽ.</p>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-applications'), 
        'vi', 
        'Xây dựng Ứng dụng Có thể Mở rộng', 
        'Các phương pháp tốt nhất để xây dựng ứng dụng có thể phát triển.',
        '<h1>Xây dựng Ứng dụng Có thể Mở rộng</h1><p>Khả năng mở rộng là rất quan trọng.</p>'
    )
ON CONFLICT (blog_post_id, language_code) DO NOTHING;

-- 4. Verify the data was added
SELECT 'Data added successfully! Here is what we have:' as message;
SELECT 'Languages:' as table_name, COUNT(*) as count FROM public.languages;
SELECT 'Blog Posts:' as table_name, COUNT(*) as count FROM public.blog_posts;
SELECT 'Translations:' as table_name, COUNT(*) as count FROM public.blog_post_translations;

-- 5. Test the relationship query
SELECT 'Testing relationship query:' as info;
SELECT 
  bp.slug,
  bp.status,
  bpt.language_code,
  bpt.title
FROM public.blog_posts bp
JOIN public.blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC; 