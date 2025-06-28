-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_projects table
CREATE TABLE public.portfolio_projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  thumbnail_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_post_tags junction table
CREATE TABLE public.blog_post_tags (
  blog_post_id INTEGER REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_portfolio_projects_status ON public.portfolio_projects(status);
CREATE INDEX idx_portfolio_projects_slug ON public.portfolio_projects(slug);
CREATE INDEX idx_tags_slug ON public.tags(slug);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view all blog posts" ON public.blog_posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blog posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blog posts" ON public.blog_posts
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for portfolio_projects
CREATE POLICY "Anyone can view published portfolio projects" ON public.portfolio_projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view all portfolio projects" ON public.portfolio_projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert portfolio projects" ON public.portfolio_projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolio projects" ON public.portfolio_projects
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own portfolio projects" ON public.portfolio_projects
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for tags
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert tags" ON public.tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for blog_post_tags
CREATE POLICY "Anyone can view blog post tags" ON public.blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage blog post tags" ON public.blog_post_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.tags (name, slug) VALUES
  ('Next.js', 'nextjs'),
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('Supabase', 'supabase'),
  ('Tailwind CSS', 'tailwind-css'),
  ('Business Analysis', 'business-analysis'),
  ('Project Management', 'project-management');

-- Insert sample blog posts (will be linked to user when they sign up)
INSERT INTO public.blog_posts (title, slug, summary, content, status, published_at) VALUES
  ('How to Build a Modern Blog with Next.js and Supabase', 'how-to-build-modern-blog', 'Learn how to create a modern, performant blog using Next.js 15 and Supabase for the backend.', '# How to Build a Modern Blog\n\nThis is a comprehensive guide on building a modern blog...', 'published', NOW()),
  ('Productivity App Case Study: From Idea to Launch', 'productivity-app-case-study', 'A detailed case study of building a productivity app from concept to production deployment.', '# Productivity App Case Study\n\nIn this case study, we explore the journey of building...', 'draft', NULL);

-- Insert sample portfolio projects
INSERT INTO public.portfolio_projects (title, slug, description, content, technologies, status, published_at) VALUES
  ('Personal Blog Platform', 'personal-blog-platform', 'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS.', '# Personal Blog Platform\n\nThis project demonstrates a full-featured blog platform...', ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'], 'published', NOW()),
  ('E-commerce Dashboard', 'ecommerce-dashboard', 'A dashboard for managing products, orders, and analytics for an e-commerce platform.', '# E-commerce Dashboard\n\nThis dashboard provides real-time analytics...', ARRAY['Next.js', 'Chart.js', 'Supabase', 'TypeScript'], 'draft', NULL); 