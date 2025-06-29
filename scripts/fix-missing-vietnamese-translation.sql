-- Fix missing Vietnamese translation for 'how-to-build-modern-blog'
-- This post only has English translation but needs Vietnamese for the homepage to work properly

-- First, let's see the current state
SELECT '=== CURRENT STATE ===' as info;
SELECT 
  bp.slug,
  bp.published_at,
  COUNT(bpt.id) as translation_count,
  STRING_AGG(bpt.language_code, ', ') as languages
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.slug = 'how-to-build-modern-blog'
GROUP BY bp.id, bp.slug, bp.published_at;

-- Add Vietnamese translation for the missing post
INSERT INTO blog_post_translations (blog_post_id, language_code, title, summary, content, created_at, updated_at)
SELECT 
  bp.id,
  'vi',
  'Cách Xây Dựng Blog Hiện Đại',
  'Hướng dẫn từng bước để tạo một blog hiện đại với Next.js, Supabase và các công nghệ mới nhất.',
  '<h1>Cách Xây Dựng Blog Hiện Đại</h1><p>Trong thời đại kỹ thuật số ngày nay, việc có một blog hiện đại là rất quan trọng để chia sẻ kiến thức và kết nối với cộng đồng.</p><h2>Những Công Nghệ Cần Thiết</h2><ul><li><strong>Next.js 15:</strong> Framework React hiện đại với App Router</li><li><strong>Supabase:</strong> Backend-as-a-Service cho database và authentication</li><li><strong>TypeScript:</strong> Ngôn ngữ lập trình type-safe</li><li><strong>Tailwind CSS:</strong> Framework CSS utility-first</li></ul><h2>Bước Tiến Hành</h2><p>Xây dựng blog hiện đại đòi hỏi sự kết hợp giữa thiết kế tốt, hiệu suất cao và trải nghiệm người dùng tuyệt vời.</p>',
  NOW(),
  NOW()
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id AND bpt.language_code = 'vi'
WHERE bp.slug = 'how-to-build-modern-blog' AND bpt.id IS NULL;

-- Show the final state
SELECT '=== FINAL STATE ===' as info;
SELECT 
  bp.slug,
  bp.published_at,
  COUNT(bpt.id) as translation_count,
  STRING_AGG(bpt.language_code, ', ') as languages
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.slug = 'how-to-build-modern-blog'
GROUP BY bp.id, bp.slug, bp.published_at;

-- Show total count of posts with both translations
SELECT '=== TOTAL POSTS WITH BOTH TRANSLATIONS ===' as info;
SELECT COUNT(*) as posts_with_both_translations
FROM blog_posts bp
WHERE bp.status = 'published' 
AND EXISTS (SELECT 1 FROM blog_post_translations bpt1 WHERE bpt1.blog_post_id = bp.id AND bpt1.language_code = 'en')
AND EXISTS (SELECT 1 FROM blog_post_translations bpt2 WHERE bpt2.blog_post_id = bp.id AND bpt2.language_code = 'vi'); 