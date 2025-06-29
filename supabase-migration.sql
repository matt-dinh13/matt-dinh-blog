-- Migration script to update existing schema for multi-language support
-- This script should be run after the initial schema is already created

-- 1. First, let's check and update the existing table structure
-- Remove NOT NULL constraints from existing tables to allow the new structure

-- Update blog_posts table to remove NOT NULL constraints
ALTER TABLE public.blog_posts 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN summary DROP NOT NULL,
ALTER COLUMN content DROP NOT NULL;

-- Update portfolio_projects table to remove NOT NULL constraints  
ALTER TABLE public.portfolio_projects 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN description DROP NOT NULL,
ALTER COLUMN content DROP NOT NULL;

-- Update tags table to remove NOT NULL constraint on name
ALTER TABLE public.tags 
ALTER COLUMN name DROP NOT NULL;

-- 2. Create languages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.languages (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'en', 'vi'
  name TEXT NOT NULL, -- 'English', 'Vietnamese'
  native_name TEXT NOT NULL, -- 'English', 'Tiếng Việt'
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create translation tables for blog posts
CREATE TABLE IF NOT EXISTS public.blog_post_translations (
  id SERIAL PRIMARY KEY,
  blog_post_id INTEGER REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blog_post_id, language_code)
);

-- 4. Create translation tables for portfolio projects
CREATE TABLE IF NOT EXISTS public.portfolio_project_translations (
  id SERIAL PRIMARY KEY,
  portfolio_project_id INTEGER REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(portfolio_project_id, language_code)
);

-- 5. Create translation tables for tags
CREATE TABLE IF NOT EXISTS public.tag_translations (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tag_id, language_code)
);

-- 6. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_language ON public.blog_post_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_portfolio_project_translations_language ON public.portfolio_project_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_tag_translations_language ON public.tag_translations(language_code);

-- 7. Enable Row Level Security for new tables
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag_translations ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies for new tables (drop existing ones first to avoid conflicts)
-- Languages
DROP POLICY IF EXISTS "Anyone can view languages" ON public.languages;
CREATE POLICY "Anyone can view languages" ON public.languages
  FOR SELECT USING (true);

-- Blog post translations
DROP POLICY IF EXISTS "Anyone can view blog post translations" ON public.blog_post_translations;
CREATE POLICY "Anyone can view blog post translations" ON public.blog_post_translations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage blog post translations" ON public.blog_post_translations;
CREATE POLICY "Authenticated users can manage blog post translations" ON public.blog_post_translations
  FOR ALL USING (auth.role() = 'authenticated');

-- Portfolio project translations
DROP POLICY IF EXISTS "Anyone can view portfolio project translations" ON public.portfolio_project_translations;
CREATE POLICY "Anyone can view portfolio project translations" ON public.portfolio_project_translations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage portfolio project translations" ON public.portfolio_project_translations;
CREATE POLICY "Authenticated users can manage portfolio project translations" ON public.portfolio_project_translations
  FOR ALL USING (auth.role() = 'authenticated');

-- Tag translations
DROP POLICY IF EXISTS "Anyone can view tag translations" ON public.tag_translations;
CREATE POLICY "Anyone can view tag translations" ON public.tag_translations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage tag translations" ON public.tag_translations;
CREATE POLICY "Authenticated users can manage tag translations" ON public.tag_translations
  FOR ALL USING (auth.role() = 'authenticated');

-- 9. Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_post_translations_updated_at ON public.blog_post_translations;
CREATE TRIGGER update_blog_post_translations_updated_at
  BEFORE UPDATE ON public.blog_post_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_project_translations_updated_at ON public.portfolio_project_translations;
CREATE TRIGGER update_portfolio_project_translations_updated_at
  BEFORE UPDATE ON public.portfolio_project_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Insert default languages (only if they don't exist)
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES 
  ('en', 'English', 'English', TRUE),
  ('vi', 'Vietnamese', 'Tiếng Việt', FALSE)
ON CONFLICT (code) DO NOTHING;

-- 11. Migrate existing data to new structure (with safety checks)
DO $$
DECLARE
    blog_record RECORD;
    tag_record RECORD;
    portfolio_record RECORD;
    blog_count INTEGER;
    tag_count INTEGER;
    portfolio_count INTEGER;
BEGIN
    -- Check what data exists
    SELECT COUNT(*) INTO blog_count FROM public.blog_posts;
    SELECT COUNT(*) INTO tag_count FROM public.tags;
    SELECT COUNT(*) INTO portfolio_count FROM public.portfolio_projects;
    
    RAISE NOTICE 'Found % blog posts, % tags, % portfolio projects', blog_count, tag_count, portfolio_count;
    
    -- Migrate existing blog posts to translations (only if they exist and have content)
    IF blog_count > 0 THEN
        FOR blog_record IN SELECT id, title, summary, content FROM public.blog_posts 
        WHERE title IS NOT NULL 
        AND id NOT IN (SELECT blog_post_id FROM public.blog_post_translations WHERE language_code = 'en')
        LOOP
            INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content, meta_title, meta_description)
            VALUES (
                blog_record.id, 
                'en', 
                blog_record.title, 
                blog_record.summary, 
                blog_record.content,
                blog_record.title || ' | Matt Dinh',
                blog_record.summary
            );
            RAISE NOTICE 'Migrated blog post ID %', blog_record.id;
        END LOOP;
    END IF;

    -- Migrate existing tags to translations (only if they exist and have names)
    IF tag_count > 0 THEN
        FOR tag_record IN SELECT id, name FROM public.tags 
        WHERE name IS NOT NULL 
        AND id NOT IN (SELECT tag_id FROM public.tag_translations WHERE language_code = 'en')
        LOOP
            INSERT INTO public.tag_translations (tag_id, language_code, name)
            VALUES (tag_record.id, 'en', tag_record.name);
            RAISE NOTICE 'Migrated tag ID %', tag_record.id;
        END LOOP;
    END IF;

    -- Migrate existing portfolio projects to translations (only if they exist and have content)
    IF portfolio_count > 0 THEN
        FOR portfolio_record IN SELECT id, title, description, content FROM public.portfolio_projects 
        WHERE title IS NOT NULL 
        AND id NOT IN (SELECT portfolio_project_id FROM public.portfolio_project_translations WHERE language_code = 'en')
        LOOP
            INSERT INTO public.portfolio_project_translations (portfolio_project_id, language_code, title, description, content, meta_title, meta_description)
            VALUES (
                portfolio_record.id, 
                'en', 
                portfolio_record.title, 
                portfolio_record.description, 
                portfolio_record.content,
                portfolio_record.title || ' | Matt Dinh',
                portfolio_record.description
            );
            RAISE NOTICE 'Migrated portfolio project ID %', portfolio_record.id;
        END LOOP;
    END IF;
END $$;

-- 12. Insert sample content only if the tables are empty
-- First, let's create some sample blog posts if none exist
INSERT INTO public.blog_posts (slug, status, published_at) 
SELECT 'my-journey-in-software-development', 'published', NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'my-journey-in-software-development');

INSERT INTO public.blog_posts (slug, status, published_at) 
SELECT 'building-scalable-web-applications', 'published', NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'building-scalable-web-applications');

INSERT INTO public.blog_posts (slug, status, published_at) 
SELECT 'art-of-problem-solving-in-tech', 'published', NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'art-of-problem-solving-in-tech');

INSERT INTO public.blog_posts (slug, status, published_at) 
SELECT 'understanding-business-requirements', 'published', NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'understanding-business-requirements');

-- Insert sample blog post translations (only for posts that exist)
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content, meta_title, meta_description) 
SELECT id, 'en', 'My Journey in Software Development', 'Reflecting on my path from beginner to professional developer, the challenges I faced, and the lessons learned along the way.', '# My Journey in Software Development\n\nThis is my personal journey from beginner to professional developer...', 'My Journey in Software Development | Matt Dinh', 'Reflecting on my path from beginner to professional developer, the challenges I faced, and the lessons learned along the way.'
FROM public.blog_posts WHERE slug = 'my-journey-in-software-development' AND id NOT IN (SELECT blog_post_id FROM public.blog_post_translations WHERE language_code = 'en');

INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content, meta_title, meta_description) 
SELECT id, 'vi', 'Hành trình của tôi trong phát triển phần mềm', 'Nhìn lại con đường từ người mới bắt đầu đến lập trình viên chuyên nghiệp, những thách thức tôi đã đối mặt và những bài học đã học được.', '# Hành trình của tôi trong phát triển phần mềm\n\nĐây là hành trình cá nhân của tôi từ người mới bắt đầu đến lập trình viên chuyên nghiệp...', 'Hành trình của tôi trong phát triển phần mềm | Matt Dinh', 'Nhìn lại con đường từ người mới bắt đầu đến lập trình viên chuyên nghiệp, những thách thức tôi đã đối mặt và những bài học đã học được.'
FROM public.blog_posts WHERE slug = 'my-journey-in-software-development' AND id NOT IN (SELECT blog_post_id FROM public.blog_post_translations WHERE language_code = 'vi');

INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content, meta_title, meta_description) 
SELECT id, 'en', 'Building Scalable Web Applications', 'A deep dive into the architecture patterns and best practices I''ve learned while building production-ready web applications.', '# Building Scalable Web Applications\n\nIn this article, I share the architecture patterns...', 'Building Scalable Web Applications | Matt Dinh', 'A deep dive into the architecture patterns and best practices I''ve learned while building production-ready web applications.'
FROM public.blog_posts WHERE slug = 'building-scalable-web-applications' AND id NOT IN (SELECT blog_post_id FROM public.blog_post_translations WHERE language_code = 'en');

INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content, meta_title, meta_description) 
SELECT id, 'vi', 'Xây dựng ứng dụng web có khả năng mở rộng', 'Tìm hiểu sâu về các mẫu kiến trúc và thực hành tốt nhất tôi đã học được khi xây dựng các ứng dụng web sẵn sàng cho sản xuất.', '# Xây dựng ứng dụng web có khả năng mở rộng\n\nTrong bài viết này, tôi chia sẻ các mẫu kiến trúc...', 'Xây dựng ứng dụng web có khả năng mở rộng | Matt Dinh', 'Tìm hiểu sâu về các mẫu kiến trúc và thực hành tốt nhất tôi đã học được khi xây dựng các ứng dụng web sẵn sàng cho sản xuất.'
FROM public.blog_posts WHERE slug = 'building-scalable-web-applications' AND id NOT IN (SELECT blog_post_id FROM public.blog_post_translations WHERE language_code = 'vi');

-- Create sample portfolio projects if none exist
INSERT INTO public.portfolio_projects (slug, technologies, status, published_at) 
SELECT 'personal-blog-platform', ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'], 'published', NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_projects WHERE slug = 'personal-blog-platform');

INSERT INTO public.portfolio_projects (slug, technologies, status, published_at) 
SELECT 'ecommerce-dashboard', ARRAY['Next.js', 'Chart.js', 'Supabase', 'TypeScript'], 'published', NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_projects WHERE slug = 'ecommerce-dashboard');

-- Insert portfolio translations
INSERT INTO public.portfolio_project_translations (portfolio_project_id, language_code, title, description, content, meta_title, meta_description) 
SELECT id, 'en', 'Personal Blog Platform', 'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS.', '# Personal Blog Platform\n\nThis project demonstrates a full-featured blog platform...', 'Personal Blog Platform | Matt Dinh', 'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS.'
FROM public.portfolio_projects WHERE slug = 'personal-blog-platform' AND id NOT IN (SELECT portfolio_project_id FROM public.portfolio_project_translations WHERE language_code = 'en');

INSERT INTO public.portfolio_project_translations (portfolio_project_id, language_code, title, description, content, meta_title, meta_description) 
SELECT id, 'vi', 'Nền tảng Blog Cá nhân', 'Một nền tảng blog hiện đại, có thể tùy chỉnh được xây dựng với Next.js, Supabase và Tailwind CSS.', '# Nền tảng Blog Cá nhân\n\nDự án này thể hiện một nền tảng blog đầy đủ tính năng...', 'Nền tảng Blog Cá nhân | Matt Dinh', 'Một nền tảng blog hiện đại, có thể tùy chỉnh được xây dựng với Next.js, Supabase và Tailwind CSS.'
FROM public.portfolio_projects WHERE slug = 'personal-blog-platform' AND id NOT IN (SELECT portfolio_project_id FROM public.portfolio_project_translations WHERE language_code = 'vi');

-- Create sample tags if none exist
INSERT INTO public.tags (slug) 
SELECT 'business-analysis'
WHERE NOT EXISTS (SELECT 1 FROM public.tags WHERE slug = 'business-analysis');

INSERT INTO public.tags (slug) 
SELECT 'project-management'
WHERE NOT EXISTS (SELECT 1 FROM public.tags WHERE slug = 'project-management');

-- Insert tag translations
INSERT INTO public.tag_translations (tag_id, language_code, name) 
SELECT id, 'en', 'Business Analysis'
FROM public.tags WHERE slug = 'business-analysis' AND id NOT IN (SELECT tag_id FROM public.tag_translations WHERE language_code = 'en');

INSERT INTO public.tag_translations (tag_id, language_code, name) 
SELECT id, 'vi', 'Phân tích Nghiệp vụ'
FROM public.tags WHERE slug = 'business-analysis' AND id NOT IN (SELECT tag_id FROM public.tag_translations WHERE language_code = 'vi');

INSERT INTO public.tag_translations (tag_id, language_code, name) 
SELECT id, 'en', 'Project Management'
FROM public.tags WHERE slug = 'project-management' AND id NOT IN (SELECT tag_id FROM public.tag_translations WHERE language_code = 'en');

INSERT INTO public.tag_translations (tag_id, language_code, name) 
SELECT id, 'vi', 'Quản lý Dự án'
FROM public.tags WHERE slug = 'project-management' AND id NOT IN (SELECT tag_id FROM public.tag_translations WHERE language_code = 'vi'); 