-- =============================================
-- Production Setup (Idempotent)
-- For Supabase SQL Editor – run once
-- Creates/updates required schema for the app
-- - Integer IDs for app entities (except auth.users UUID)
-- - Unified shared_images with (entity_type, entity_id)
-- - RLS policies, triggers, indexes
-- - Basic seed for languages and tags
-- =============================================

-- ===============
-- USERS (profile)
-- ===============
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Handle user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at utility
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- ============
-- LANGUAGES
-- ============
CREATE TABLE IF NOT EXISTS public.languages (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view languages" ON public.languages FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============
-- BLOG POSTS
-- ============
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Ensure thumbnail_url exists
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (status = 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can view all blog posts" ON public.blog_posts FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update their own blog posts" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can delete their own blog posts" ON public.blog_posts FOR DELETE USING (auth.uid() = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BLOG POST TRANSLATIONS
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
  UNIQUE (blog_post_id, language_code)
);
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view blog post translations" ON public.blog_post_translations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage blog post translations" ON public.blog_post_translations FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_blog_post_translations_updated_at ON public.blog_post_translations;
CREATE TRIGGER update_blog_post_translations_updated_at
  BEFORE UPDATE ON public.blog_post_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============
-- PORTFOLIO
-- ============
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view published portfolio projects" ON public.portfolio_projects FOR SELECT USING (status = 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can view all portfolio projects" ON public.portfolio_projects FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert portfolio projects" ON public.portfolio_projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update their own portfolio projects" ON public.portfolio_projects FOR UPDATE USING (auth.uid() = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can delete their own portfolio projects" ON public.portfolio_projects FOR DELETE USING (auth.uid() = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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
  UNIQUE (portfolio_project_id, language_code)
);
ALTER TABLE public.portfolio_project_translations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view portfolio project translations" ON public.portfolio_project_translations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage portfolio project translations" ON public.portfolio_project_translations FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_portfolio_project_translations_updated_at ON public.portfolio_project_translations;
CREATE TRIGGER update_portfolio_project_translations_updated_at
  BEFORE UPDATE ON public.portfolio_project_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============
-- TAGS
-- ============
CREATE TABLE IF NOT EXISTS public.tags (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert tags" ON public.tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.tag_translations (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (tag_id, language_code)
);
ALTER TABLE public.tag_translations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view tag translations" ON public.tag_translations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage tag translations" ON public.tag_translations FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Junction for tags
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  blog_post_id INTEGER REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, tag_id)
);
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can view blog post tags" ON public.blog_post_tags FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage blog post tags" ON public.blog_post_tags FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============
-- SHARED IMAGES (Unified: entity_type/entity_id)
-- ============
CREATE TABLE IF NOT EXISTS public.shared_images (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('blog','portfolio')),
  entity_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  original_filename TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE (entity_type, entity_id, image_url)
);

CREATE INDEX IF NOT EXISTS idx_shared_images_entity ON public.shared_images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_shared_images_active ON public.shared_images(is_active);
ALTER TABLE public.shared_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view shared images" ON public.shared_images;
  CREATE POLICY "Anyone can view shared images" ON public.shared_images FOR SELECT USING (true);
EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Authenticated users can manage shared images" ON public.shared_images;
  CREATE POLICY "Authenticated users can manage shared images" ON public.shared_images FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN undefined_object THEN NULL; END $$;

-- ============
-- ACTIVITY LOG
-- ============
CREATE TABLE IF NOT EXISTS public.activity_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Authenticated can read activity log" ON public.activity_log FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated can insert activity log" ON public.activity_log FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============
-- INDEXES (ensure)
-- ============
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_language ON public.blog_post_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_status ON public.portfolio_projects(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_slug ON public.portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_project_translations_language ON public.portfolio_project_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);
CREATE INDEX IF NOT EXISTS idx_tag_translations_language ON public.tag_translations(language_code);

-- ============
-- TRIGGERS for updated_at where missing
-- ============
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============
-- STORAGE POLICIES (bucket: images)
-- ============
-- Ensure bucket exists from UI (Storage -> Buckets). Policies apply at storage.objects.
-- Public read, authenticated write for bucket 'images'

DO $$ BEGIN
  CREATE POLICY "Public can read images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'images'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND auth.role() = 'authenticated'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'images' AND auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'images' AND auth.role() = 'authenticated'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Optional seed (safe if missing)
INSERT INTO public.languages (code, name, native_name, is_default) VALUES
  ('en','English','English', TRUE)
ON CONFLICT (code) DO NOTHING;
INSERT INTO public.languages (code, name, native_name, is_default) VALUES
  ('vi','Vietnamese','Tiếng Việt', FALSE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.tags (slug) VALUES
  ('nextjs'),('react'),('typescript'),('supabase'),('tailwind-css'),('business-analysis'),('project-management')
ON CONFLICT (slug) DO NOTHING; 