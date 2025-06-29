-- Check Database Tables
-- Run this in your Supabase SQL Editor to see what tables exist

-- Check all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if our specific tables exist
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'languages') 
    THEN 'EXISTS' ELSE 'MISSING' END as languages_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') 
    THEN 'EXISTS' ELSE 'MISSING' END as blog_posts_table,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_post_translations') 
    THEN 'EXISTS' ELSE 'MISSING' END as blog_post_translations_table;

-- If tables exist, show their structure
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'languages') THEN
    RAISE NOTICE 'Languages table structure:';
    RAISE NOTICE '%', (SELECT string_agg(column_name || ' ' || data_type, ', ') FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'languages');
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
    RAISE NOTICE 'Blog posts table structure:';
    RAISE NOTICE '%', (SELECT string_agg(column_name || ' ' || data_type, ', ') FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_posts');
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_post_translations') THEN
    RAISE NOTICE 'Blog post translations table structure:';
    RAISE NOTICE '%', (SELECT string_agg(column_name || ' ' || data_type, ', ') FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blog_post_translations');
  END IF;
END $$; 