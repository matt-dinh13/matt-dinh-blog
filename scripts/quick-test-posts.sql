-- Quick test to check current posts and add some if needed
SELECT 'Current posts count:' as info;
SELECT COUNT(*) as total_posts FROM blog_posts WHERE status = 'published';

-- Add 3 more test posts if we have less than 6
INSERT INTO blog_posts (slug, status, published_at, thumbnail_url, created_at, updated_at) 
SELECT 
  'test-post-' || generate_series(1, 3),
  'published',
  NOW() - (generate_series(1, 3) || ' days')::interval,
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
  NOW(),
  NOW()
WHERE (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') < 6
ON CONFLICT (slug) DO NOTHING;

-- Add translations for the new test posts
INSERT INTO blog_post_translations (blog_post_id, language_code, title, summary, content, created_at, updated_at)
SELECT 
  bp.id,
  'en',
  'Test Post ' || bp.id,
  'This is a test post for homepage pagination testing.',
  '<h1>Test Post ' || bp.id || '</h1><p>This is a test post to ensure the homepage shows 6 posts by default.</p>',
  NOW(),
  NOW()
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id AND bpt.language_code = 'en'
WHERE bp.slug LIKE 'test-post-%' AND bpt.id IS NULL;

INSERT INTO blog_post_translations (blog_post_id, language_code, title, summary, content, created_at, updated_at)
SELECT 
  bp.id,
  'vi',
  'Bài Viết Test ' || bp.id,
  'Đây là bài viết test cho việc kiểm tra phân trang trang chủ.',
  '<h1>Bài Viết Test ' || bp.id || '</h1><p>Đây là bài viết test để đảm bảo trang chủ hiển thị 6 bài viết mặc định.</p>',
  NOW(),
  NOW()
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id AND bpt.language_code = 'vi'
WHERE bp.slug LIKE 'test-post-%' AND bpt.id IS NULL;

-- Show final count
SELECT 'Final posts count:' as info;
SELECT COUNT(*) as total_posts FROM blog_posts WHERE status = 'published';

SELECT 'Posts with translations:' as info;
SELECT 
  bp.slug,
  COUNT(bpt.id) as translation_count
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
GROUP BY bp.id, bp.slug
ORDER BY bp.published_at DESC; 