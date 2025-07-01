-- Create about_me table with multi-language support
CREATE TABLE IF NOT EXISTS public.about_me (
  id SERIAL PRIMARY KEY,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about_me_translations table for multi-language content
CREATE TABLE IF NOT EXISTS public.about_me_translations (
  id SERIAL PRIMARY KEY,
  about_me_id INTEGER REFERENCES public.about_me(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(about_me_id, language_code)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_about_me_status ON public.about_me(status);
CREATE INDEX IF NOT EXISTS idx_about_me_translations_language ON public.about_me_translations(language_code);

-- Enable Row Level Security
ALTER TABLE public.about_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_me_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for about_me
CREATE POLICY "Anyone can view published about me" ON public.about_me
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view all about me" ON public.about_me
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert about me" ON public.about_me
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own about me" ON public.about_me
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own about me" ON public.about_me
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for about_me_translations
CREATE POLICY "Anyone can view about me translations" ON public.about_me_translations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage about me translations" ON public.about_me_translations
  FOR ALL USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_about_me_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_about_me_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_about_me_updated_at
  BEFORE UPDATE ON public.about_me
  FOR EACH ROW EXECUTE FUNCTION public.update_about_me_updated_at();

CREATE TRIGGER update_about_me_translations_updated_at
  BEFORE UPDATE ON public.about_me_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_about_me_translations_updated_at();

-- Insert default about me record
INSERT INTO public.about_me (status, published_at) 
VALUES ('published', NOW())
ON CONFLICT DO NOTHING;

-- Insert default translations
INSERT INTO public.about_me_translations (about_me_id, language_code, title, subtitle, content, meta_title, meta_description) 
VALUES
(1, 'en', 'About Me', 'Software Engineer & Business Analyst', 
'# About Me

Hello! I''m Matt Dinh, a passionate software engineer and business analyst with a love for creating meaningful solutions that bridge technology and business needs.

With over 5 years of experience in software development and business analysis, I specialize in building scalable web applications, analyzing business requirements, and translating complex problems into elegant technical solutions.

## Skills & Expertise

### Technical Skills
- JavaScript/TypeScript
- React/Next.js
- Node.js/Python
- PostgreSQL/MongoDB
- Docker/AWS

### Business Analysis
- Requirements Gathering
- Process Modeling
- Stakeholder Management
- Data Analysis
- Project Management

### Soft Skills
- Problem Solving
- Communication
- Team Leadership
- Critical Thinking
- Adaptability

## Professional Experience

### Senior Software Engineer
**Tech Solutions Inc.** | 2022 - Present

Leading development of enterprise web applications, mentoring junior developers, and collaborating with cross-functional teams.

## Education

### Bachelor of Computer Science
**University of Technology** | 2019

## Get In Touch

I''m always interested in new opportunities and collaborations. Feel free to reach out!

- **Email:** matt@example.com
- **LinkedIn:** [linkedin.com/in/mattdinh](https://linkedin.com/in/mattdinh)
- **GitHub:** [github.com/mattdinh](https://github.com/mattdinh)',
'About Me | Matt Dinh',
'Learn more about Matt Dinh - software engineer, business analyst, and technology enthusiast.'),

(1, 'vi', 'Về Tôi', 'Kỹ Sư Phần Mềm & Phân Tích Viên Kinh Doanh',
'# Về Tôi

Xin chào! Tôi là Matt Dinh, một kỹ sư phần mềm và phân tích viên kinh doanh đam mê, với tình yêu tạo ra những giải pháp có ý nghĩa kết nối công nghệ và nhu cầu kinh doanh.

Với hơn 5 năm kinh nghiệm trong phát triển phần mềm và phân tích kinh doanh, tôi chuyên về xây dựng các ứng dụng web có khả năng mở rộng, phân tích yêu cầu kinh doanh và chuyển đổi các vấn đề phức tạp thành các giải pháp kỹ thuật thanh lịch.

## Kỹ Năng & Chuyên Môn

### Kỹ Năng Kỹ Thuật
- JavaScript/TypeScript
- React/Next.js
- Node.js/Python
- PostgreSQL/MongoDB
- Docker/AWS

### Phân Tích Kinh Doanh
- Thu thập Yêu cầu
- Mô hình hóa Quy trình
- Quản lý Các bên liên quan
- Phân tích Dữ liệu
- Quản lý Dự án

### Kỹ Năng Mềm
- Giải quyết Vấn đề
- Giao tiếp
- Lãnh đạo Nhóm
- Tư duy Phản biện
- Thích ứng

## Kinh Nghiệm Chuyên Môn

### Kỹ Sư Phần Mềm Cao Cấp
**Tech Solutions Inc.** | 2022 - Hiện Tại

Lãnh đạo phát triển các ứng dụng web doanh nghiệp, hướng dẫn các lập trình viên trẻ và hợp tác với các nhóm đa chức năng.

## Học Vấn

### Cử Nhân Khoa Học Máy Tính
**Đại Học Công Nghệ** | 2019

## Liên Hệ

Tôi luôn quan tâm đến những cơ hội mới và sự hợp tác. Hãy liên hệ với tôi!

- **Email:** matt@example.com
- **LinkedIn:** [linkedin.com/in/mattdinh](https://linkedin.com/in/mattdinh)
- **GitHub:** [github.com/mattdinh](https://github.com/mattdinh)',
'Về Tôi | Matt Dinh',
'Tìm hiểu thêm về Matt Dinh - kỹ sư phần mềm, phân tích viên kinh doanh và người đam mê công nghệ.'); 