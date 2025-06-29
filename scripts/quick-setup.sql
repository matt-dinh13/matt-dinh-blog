-- Quick Setup Script for Testing
-- Run this in your Supabase SQL Editor to add test data

-- 1. Add languages
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES 
  ('en', 'English', 'English', true),
  ('vi', 'Vietnamese', 'Tiếng Việt', false)
ON CONFLICT (code) DO NOTHING;

-- 2. Add a test blog post
INSERT INTO public.blog_posts (slug, status, published_at) 
VALUES ('test-post', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 3. Add translations for the test post
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
  (
    (SELECT id FROM public.blog_posts WHERE slug = 'test-post'), 
    'en', 
    'Welcome to My Blog', 
    'This is a test post to verify that your blog is working correctly.',
    '<h1>Welcome to My Blog</h1><p>This is a test post to verify that your blog is working correctly. If you can see this post, it means your Supabase connection is working!</p><h2>What next?</h2><p>You can now add more posts through the admin panel or directly in the database.</p>'
  ),
  (
    (SELECT id FROM public.blog_posts WHERE slug = 'test-post'), 
    'vi', 
    'Chào mừng đến với Blog của tôi', 
    'Đây là bài viết thử nghiệm để kiểm tra xem blog của bạn có hoạt động đúng không.',
    '<h1>Chào mừng đến với Blog của tôi</h1><p>Đây là bài viết thử nghiệm để kiểm tra xem blog của bạn có hoạt động đúng không. Nếu bạn có thể thấy bài viết này, điều đó có nghĩa là kết nối Supabase của bạn đang hoạt động!</p><h2>Tiếp theo là gì?</h2><p>Bây giờ bạn có thể thêm nhiều bài viết hơn thông qua bảng quản trị hoặc trực tiếp trong cơ sở dữ liệu.</p>'
  )
ON CONFLICT (blog_post_id, language_code) DO NOTHING;

-- 4. Add another test post
INSERT INTO public.blog_posts (slug, status, published_at) 
VALUES ('second-test-post', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
  (
    (SELECT id FROM public.blog_posts WHERE slug = 'second-test-post'), 
    'en', 
    'Getting Started with Next.js', 
    'Learn how to build modern web applications with Next.js and Supabase.',
    '<h1>Getting Started with Next.js</h1><p>Next.js is a powerful React framework that makes building full-stack web applications simple and efficient.</p><h2>Why Next.js?</h2><ul><li>Server-side rendering</li><li>Static site generation</li><li>API routes</li><li>Excellent developer experience</li></ul>'
  ),
  (
    (SELECT id FROM public.blog_posts WHERE slug = 'second-test-post'), 
    'vi', 
    'Bắt đầu với Next.js', 
    'Học cách xây dựng ứng dụng web hiện đại với Next.js và Supabase.',
    '<h1>Bắt đầu với Next.js</h1><p>Next.js là một framework React mạnh mẽ giúp việc xây dựng ứng dụng web full-stack trở nên đơn giản và hiệu quả.</p><h2>Tại sao Next.js?</h2><ul><li>Server-side rendering</li><li>Static site generation</li><li>API routes</li><li>Trải nghiệm phát triển tuyệt vời</li></ul>'
  )
ON CONFLICT (blog_post_id, language_code) DO NOTHING;

-- 5. Verify the data was added
SELECT 'Languages:' as info;
SELECT * FROM public.languages;

SELECT 'Blog Posts:' as info;
SELECT id, slug, status, published_at FROM public.blog_posts;

SELECT 'Translations:' as info;
SELECT 
  bpt.id,
  bpt.blog_post_id,
  bpt.language_code,
  bpt.title,
  bp.slug
FROM public.blog_post_translations bpt
JOIN public.blog_posts bp ON bpt.blog_post_id = bp.id; 