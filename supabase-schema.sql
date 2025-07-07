-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create languages table
CREATE TABLE public.languages (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'en', 'vi'
  name TEXT NOT NULL, -- 'English', 'Vietnamese'
  native_name TEXT NOT NULL, -- 'English', 'Tiếng Việt'
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table with multi-language support
CREATE TABLE public.blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_post_translations table for multi-language content
CREATE TABLE public.blog_post_translations (
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

-- Create portfolio_projects table with multi-language support
CREATE TABLE public.portfolio_projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
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

-- Create portfolio_project_translations table for multi-language content
CREATE TABLE public.portfolio_project_translations (
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

-- Create tags table with multi-language support
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tag_translations table for multi-language tag names
CREATE TABLE public.tag_translations (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tag_id, language_code)
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
CREATE INDEX idx_blog_post_translations_language ON public.blog_post_translations(language_code);
CREATE INDEX idx_portfolio_projects_status ON public.portfolio_projects(status);
CREATE INDEX idx_portfolio_projects_slug ON public.portfolio_projects(slug);
CREATE INDEX idx_portfolio_project_translations_language ON public.portfolio_project_translations(language_code);
CREATE INDEX idx_tags_slug ON public.tags(slug);
CREATE INDEX idx_tag_translations_language ON public.tag_translations(language_code);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for languages
CREATE POLICY "Anyone can view languages" ON public.languages
  FOR SELECT USING (true);

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

-- RLS Policies for blog_post_translations
CREATE POLICY "Anyone can view blog post translations" ON public.blog_post_translations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage blog post translations" ON public.blog_post_translations
  FOR ALL USING (auth.role() = 'authenticated');

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

-- RLS Policies for portfolio_project_translations
CREATE POLICY "Anyone can view portfolio project translations" ON public.portfolio_project_translations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage portfolio project translations" ON public.portfolio_project_translations
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for tags
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert tags" ON public.tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for tag_translations
CREATE POLICY "Anyone can view tag translations" ON public.tag_translations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tag translations" ON public.tag_translations
  FOR ALL USING (auth.role() = 'authenticated');

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

CREATE TRIGGER update_blog_post_translations_updated_at
  BEFORE UPDATE ON public.blog_post_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_project_translations_updated_at
  BEFORE UPDATE ON public.portfolio_project_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default languages
INSERT INTO public.languages (code, name, native_name, is_default) VALUES
  ('en', 'English', 'English', TRUE),
  ('vi', 'Vietnamese', 'Tiếng Việt', FALSE);

-- Insert sample tags
INSERT INTO public.tags (slug) VALUES
  ('nextjs'),
  ('react'),
  ('typescript'),
  ('supabase'),
  ('tailwind-css'),
  ('business-analysis'),
  ('project-management');

-- Insert tag translations
INSERT INTO public.tag_translations (tag_id, language_code, name) VALUES
  (1, 'en', 'Next.js'),
  (1, 'vi', 'Next.js'),
  (2, 'en', 'React'),
  (2, 'vi', 'React'),
  (3, 'en', 'TypeScript'),
  (3, 'vi', 'TypeScript'),
  (4, 'en', 'Supabase'),
  (4, 'vi', 'Supabase'),
  (5, 'en', 'Tailwind CSS'),
  (5, 'vi', 'Tailwind CSS'),
  (6, 'en', 'Business Analysis'),
  (6, 'vi', 'Phân tích Nghiệp vụ'),
  (7, 'en', 'Project Management'),
  (7, 'vi', 'Quản lý Dự án');

-- Insert sample blog posts (will be linked to user when they sign up)
INSERT INTO public.blog_posts (slug, status, published_at) VALUES
  ('my-journey-in-software-development', 'published', NOW()),
  ('building-scalable-web-applications', 'published', NOW()),
  ('art-of-problem-solving-in-tech', 'published', NOW()),
  ('understanding-business-requirements', 'published', NOW());

-- Insert blog post translations
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content, meta_title, meta_description) VALUES
  (1, 'en', 'My Journey in Software Development', 'Reflecting on my path from beginner to professional developer, the challenges I faced, and the lessons learned along the way.', '# My Journey in Software Development\n\nThis is my personal journey from beginner to professional developer...', 'My Journey in Software Development | Matt Dinh', 'Reflecting on my path from beginner to professional developer, the challenges I faced, and the lessons learned along the way.'),
  (1, 'vi', 'Hành trình của tôi trong phát triển phần mềm', 'Nhìn lại con đường từ người mới bắt đầu đến lập trình viên chuyên nghiệp, những thách thức tôi đã đối mặt và những bài học đã học được.', '# Hành trình của tôi trong phát triển phần mềm\n\nĐây là hành trình cá nhân của tôi từ người mới bắt đầu đến lập trình viên chuyên nghiệp...', 'Hành trình của tôi trong phát triển phần mềm | Matt Dinh', 'Nhìn lại con đường từ người mới bắt đầu đến lập trình viên chuyên nghiệp, những thách thức tôi đã đối mặt và những bài học đã học được.'),
  (2, 'en', 'Building Scalable Web Applications', 'A deep dive into the architecture patterns and best practices I''ve learned while building production-ready web applications.', '# Building Scalable Web Applications\n\nIn this article, I share the architecture patterns...', 'Building Scalable Web Applications | Matt Dinh', 'A deep dive into the architecture patterns and best practices I''ve learned while building production-ready web applications.'),
  (2, 'vi', 'Xây dựng ứng dụng web có khả năng mở rộng', 'Tìm hiểu sâu về các mẫu kiến trúc và thực hành tốt nhất tôi đã học được khi xây dựng các ứng dụng web sẵn sàng cho sản xuất.', '# Xây dựng ứng dụng web có khả năng mở rộng\n\nTrong bài viết này, tôi chia sẻ các mẫu kiến trúc...', 'Xây dựng ứng dụng web có khả năng mở rộng | Matt Dinh', 'Tìm hiểu sâu về các mẫu kiến trúc và thực hành tốt nhất tôi đã học được khi xây dựng các ứng dụng web sẵn sàng cho sản xuất.'),
  (3, 'en', 'The Art of Problem Solving in Tech', 'How I approach complex technical problems and the systematic methods that help me find effective solutions.', '# The Art of Problem Solving in Tech\n\nProblem solving is a crucial skill in technology...', 'The Art of Problem Solving in Tech | Matt Dinh', 'How I approach complex technical problems and the systematic methods that help me find effective solutions.'),
  (3, 'vi', 'Nghệ thuật giải quyết vấn đề trong công nghệ', 'Cách tôi tiếp cận các vấn đề kỹ thuật phức tạp và các phương pháp có hệ thống giúp tôi tìm ra giải pháp hiệu quả.', '# Nghệ thuật giải quyết vấn đề trong công nghệ\n\nGiải quyết vấn đề là một kỹ năng quan trọng trong công nghệ...', 'Nghệ thuật giải quyết vấn đề trong công nghệ | Matt Dinh', 'Cách tôi tiếp cận các vấn đề kỹ thuật phức tạp và các phương pháp có hệ thống giúp tôi tìm ra giải pháp hiệu quả.'),
  (4, 'en', 'Understanding Business Requirements', 'A comprehensive guide to gathering, analyzing, and documenting business requirements effectively.', '# Understanding Business Requirements\n\nBusiness requirements are the foundation of any successful project...', 'Understanding Business Requirements | Matt Dinh', 'A comprehensive guide to gathering, analyzing, and documenting business requirements effectively.'),
  (4, 'vi', 'Hiểu về yêu cầu nghiệp vụ', 'Hướng dẫn toàn diện về thu thập, phân tích và tài liệu hóa yêu cầu nghiệp vụ một cách hiệu quả.', '# Hiểu về yêu cầu nghiệp vụ\n\nYêu cầu nghiệp vụ là nền tảng của bất kỳ dự án thành công nào...', 'Hiểu về yêu cầu nghiệp vụ | Matt Dinh', 'Hướng dẫn toàn diện về thu thập, phân tích và tài liệu hóa yêu cầu nghiệp vụ một cách hiệu quả.');

-- Insert sample portfolio projects
INSERT INTO public.portfolio_projects (slug, technologies, status, published_at) VALUES
  ('personal-blog-platform', ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'], 'published', NOW()),
  ('ecommerce-dashboard', ARRAY['Next.js', 'Chart.js', 'Supabase', 'TypeScript'], 'published', NOW());

-- Insert portfolio project translations
INSERT INTO public.portfolio_project_translations (portfolio_project_id, language_code, title, description, content, meta_title, meta_description) VALUES
  (1, 'en', 'Personal Blog Platform', 'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS.', '# Personal Blog Platform\n\nThis project demonstrates a full-featured blog platform...', 'Personal Blog Platform | Matt Dinh', 'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS.'),
  (1, 'vi', 'Nền tảng Blog Cá nhân', 'Một nền tảng blog hiện đại, có thể tùy chỉnh được xây dựng với Next.js, Supabase và Tailwind CSS.', '# Nền tảng Blog Cá nhân\n\nDự án này thể hiện một nền tảng blog đầy đủ tính năng...', 'Nền tảng Blog Cá nhân | Matt Dinh', 'Một nền tảng blog hiện đại, có thể tùy chỉnh được xây dựng với Next.js, Supabase và Tailwind CSS.'),
  (2, 'en', 'E-commerce Dashboard', 'A dashboard for managing products, orders, and analytics for an e-commerce platform.', '# E-commerce Dashboard\n\nThis dashboard provides real-time analytics...', 'E-commerce Dashboard | Matt Dinh', 'A dashboard for managing products, orders, and analytics for an e-commerce platform.'),
  (2, 'vi', 'Bảng điều khiển Thương mại điện tử', 'Một bảng điều khiển để quản lý sản phẩm, đơn hàng và phân tích cho nền tảng thương mại điện tử.', '# Bảng điều khiển Thương mại điện tử\n\nBảng điều khiển này cung cấp phân tích thời gian thực...', 'Bảng điều khiển Thương mại điện tử | Matt Dinh', 'Một bảng điều khiển để quản lý sản phẩm, đơn hàng và phân tích cho nền tảng thương mại điện tử.');

-- Add thumbnail_url to blog_posts
ALTER TABLE blog_posts ADD COLUMN thumbnail_url TEXT; 