-- Check Database Status
-- Run this in your Supabase SQL Editor to see what's in your database

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('blog_posts', 'blog_post_translations', 'languages');

-- Check languages
SELECT * FROM public.languages;

-- Check blog posts
SELECT id, slug, status, published_at, created_at FROM public.blog_posts;

-- Check blog post translations
SELECT 
  bpt.id,
  bpt.blog_post_id,
  bpt.language_code,
  bpt.title,
  bp.slug,
  bp.status
FROM public.blog_post_translations bpt
JOIN public.blog_posts bp ON bpt.blog_post_id = bp.id;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('blog_posts', 'blog_post_translations');

-- If no data exists, run this to add a simple test post:
/*
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES ('en', 'English', 'English', true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.blog_posts (slug, status, published_at) 
VALUES ('test-post', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES (
  (SELECT id FROM public.blog_posts WHERE slug = 'test-post'), 
  'en', 
  'Test Post', 
  'This is a test post to verify the database connection.',
  '<h1>Test Post</h1><p>This is a test post to verify that your database connection is working properly.</p>'
)
ON CONFLICT (blog_post_id, language_code) DO NOTHING;
*/ 