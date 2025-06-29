-- Seed data for Matt Dinh Blog
-- Run this in your Supabase SQL editor

-- First, ensure we have the languages
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES 
  ('en', 'English', 'English', true),
  ('vi', 'Vietnamese', 'Tiếng Việt', false)
ON CONFLICT (code) DO NOTHING;

-- Insert sample blog posts
INSERT INTO public.blog_posts (slug, status, published_at) 
VALUES 
  ('my-journey-in-software-development', 'published', '2024-01-15T00:00:00Z'),
  ('building-scalable-web-applications', 'published', '2024-01-10T00:00:00Z'),
  ('understanding-business-requirements', 'published', '2024-01-05T00:00:00Z')
ON CONFLICT (slug) DO NOTHING;

-- Insert blog post translations
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
  -- English translations
  ((SELECT id FROM public.blog_posts WHERE slug = 'my-journey-in-software-development'), 'en', 
   'My Journey in Software Development', 
   'Reflecting on my path from beginner to professional developer, the challenges I faced, and the lessons learned along the way.',
   '<h2>The Beginning</h2><p>My journey in software development began with a simple curiosity about how websites work. I remember the first time I opened the browser''s developer tools and saw the HTML structure - it was like discovering a new language.</p><h2>The Learning Phase</h2><p>I started with HTML and CSS, then moved to JavaScript. The transition from static pages to interactive applications was both challenging and exciting. Every bug I fixed felt like a small victory.</p><h2>Professional Growth</h2><p>As I progressed in my career, I learned that software development is not just about writing code. It''s about solving problems, working in teams, and continuously learning new technologies.</p><h2>Key Lessons Learned</h2><ul><li>Always write clean, readable code</li><li>Test your code thoroughly</li><li>Stay updated with industry trends</li><li>Collaborate effectively with team members</li></ul><h2>Looking Forward</h2><p>The technology landscape is constantly evolving, and I''m excited to continue learning and growing as a developer. There''s always something new to discover.</p>'),
  
  ((SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-web-applications'), 'en', 
   'Building Scalable Web Applications', 
   'A deep dive into architecture patterns and best practices for scalable web apps.',
   '<h2>Introduction to Scalability</h2><p>Building scalable web applications is one of the most challenging aspects of modern software development. It requires careful planning, architectural decisions, and continuous optimization.</p><h2>Architecture Patterns</h2><p>There are several key architectural patterns that help in building scalable applications:</p><ul><li>Microservices Architecture</li><li>Event-Driven Architecture</li><li>Load Balancing</li><li>Database Sharding</li><li>Caching Strategies</li></ul><h2>Best Practices</h2><p>Some of the best practices I''ve learned include:</p><ul><li>Design for failure</li><li>Use horizontal scaling</li><li>Implement proper monitoring</li><li>Optimize database queries</li><li>Use CDN for static assets</li></ul><h2>Technology Stack</h2><p>For scalable applications, I prefer using:</p><ul><li>Next.js for the frontend</li><li>Node.js for the backend</li><li>PostgreSQL for the database</li><li>Redis for caching</li><li>Docker for containerization</li></ul><h2>Conclusion</h2><p>Building scalable applications is an ongoing process that requires constant learning and adaptation. The key is to start with a solid foundation and iterate based on real-world usage patterns.</p>'),
  
  ((SELECT id FROM public.blog_posts WHERE slug = 'understanding-business-requirements'), 'en', 
   'Understanding Business Requirements', 
   'A comprehensive guide to gathering, analyzing, and documenting business requirements effectively.',
   '<h2>The Importance of Requirements</h2><p>Understanding business requirements is crucial for building successful software solutions. It''s the bridge between business needs and technical implementation.</p><h2>Requirements Gathering Process</h2><p>The process typically involves:</p><ul><li>Stakeholder interviews</li><li>Documentation review</li><li>Process observation</li><li>Workshop facilitation</li><li>Prototype development</li></ul><h2>Types of Requirements</h2><p>Business requirements can be categorized into:</p><ul><li>Functional requirements</li><li>Non-functional requirements</li><li>Business rules</li><li>User stories</li><li>Acceptance criteria</li></ul><h2>Common Challenges</h2><p>Some challenges I''ve encountered include:</p><ul><li>Unclear or conflicting requirements</li><li>Stakeholder communication gaps</li><li>Scope creep</li><li>Changing business needs</li><li>Technical constraints</li></ul><h2>Best Practices</h2><p>To ensure successful requirements gathering:</p><ul><li>Use clear, unambiguous language</li><li>Validate requirements with stakeholders</li><li>Document assumptions and constraints</li><li>Create visual models when helpful</li><li>Maintain traceability</li></ul><h2>Conclusion</h2><p>Effective requirements gathering is an iterative process that requires patience, communication skills, and a deep understanding of both business and technical domains.</p>'),
  
  -- Vietnamese translations
  ((SELECT id FROM public.blog_posts WHERE slug = 'my-journey-in-software-development'), 'vi', 
   'Hành Trình Phát Triển Phần Mềm Của Tôi', 
   'Nhìn lại con đường từ người mới bắt đầu đến lập trình viên chuyên nghiệp, những thách thức tôi đã đối mặt và những bài học đã học được.',
   '<h2>Khởi Đầu</h2><p>Hành trình phát triển phần mềm của tôi bắt đầu với sự tò mò đơn giản về cách các trang web hoạt động. Tôi nhớ lần đầu tiên mở developer tools của trình duyệt và thấy cấu trúc HTML - nó giống như khám phá một ngôn ngữ mới.</p><h2>Giai Đoạn Học Hỏi</h2><p>Tôi bắt đầu với HTML và CSS, sau đó chuyển sang JavaScript. Việc chuyển đổi từ các trang tĩnh sang ứng dụng tương tác vừa thách thức vừa thú vị. Mỗi lỗi tôi sửa đều cảm thấy như một chiến thắng nhỏ.</p><h2>Phát Triển Chuyên Môn</h2><p>Khi tiến bộ trong sự nghiệp, tôi học được rằng phát triển phần mềm không chỉ là viết code. Đó là về giải quyết vấn đề, làm việc trong nhóm và liên tục học hỏi công nghệ mới.</p><h2>Những Bài Học Quan Trọng</h2><ul><li>Luôn viết code sạch, dễ đọc</li><li>Kiểm thử code kỹ lưỡng</li><li>Cập nhật xu hướng ngành</li><li>Cộng tác hiệu quả với thành viên nhóm</li></ul><h2>Nhìn Về Tương Lai</h2><p>Lĩnh vực công nghệ không ngừng phát triển, và tôi rất hào hứng tiếp tục học hỏi và phát triển như một lập trình viên. Luôn có điều gì đó mới để khám phá.</p>'),
  
  ((SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-web-applications'), 'vi', 
   'Xây Dựng Ứng Dụng Web Có Khả Năng Mở Rộng', 
   'Tìm hiểu sâu về các mẫu kiến trúc và thực hành tốt nhất khi xây dựng các ứng dụng web sẵn sàng cho sản xuất.',
   '<h2>Giới Thiệu Về Khả Năng Mở Rộng</h2><p>Xây dựng ứng dụng web có khả năng mở rộng là một trong những khía cạnh thách thức nhất của phát triển phần mềm hiện đại. Nó đòi hỏi lập kế hoạch cẩn thận, quyết định kiến trúc và tối ưu hóa liên tục.</p><h2>Mẫu Kiến Trúc</h2><p>Có một số mẫu kiến trúc chính giúp xây dựng ứng dụng có khả năng mở rộng:</p><ul><li>Kiến Trúc Microservices</li><li>Kiến Trúc Hướng Sự Kiện</li><li>Cân Bằng Tải</li><li>Phân Mảnh Cơ Sở Dữ Liệu</li><li>Chiến Lược Cache</li></ul><h2>Thực Hành Tốt Nhất</h2><p>Một số thực hành tốt nhất tôi đã học được:</p><ul><li>Thiết kế cho thất bại</li><li>Sử dụng mở rộng ngang</li><li>Triển khai giám sát phù hợp</li><li>Tối ưu hóa truy vấn cơ sở dữ liệu</li><li>Sử dụng CDN cho tài nguyên tĩnh</li></ul><h2>Stack Công Nghệ</h2><p>Đối với ứng dụng có khả năng mở rộng, tôi thích sử dụng:</p><ul><li>Next.js cho frontend</li><li>Node.js cho backend</li><li>PostgreSQL cho cơ sở dữ liệu</li><li>Redis cho cache</li><li>Docker cho containerization</li></ul><h2>Kết Luận</h2><p>Xây dựng ứng dụng có khả năng mở rộng là một quá trình liên tục đòi hỏi học hỏi và thích ứng không ngừng. Chìa khóa là bắt đầu với nền tảng vững chắc và lặp lại dựa trên mô hình sử dụng thực tế.</p>'),
  
  ((SELECT id FROM public.blog_posts WHERE slug = 'understanding-business-requirements'), 'vi', 
   'Hiểu Biết Yêu Cầu Kinh Doanh', 
   'Hướng dẫn toàn diện về thu thập, phân tích và tài liệu hóa yêu cầu kinh doanh một cách hiệu quả.',
   '<h2>Tầm Quan Trọng Của Yêu Cầu</h2><p>Hiểu biết yêu cầu kinh doanh là rất quan trọng để xây dựng giải pháp phần mềm thành công. Đó là cầu nối giữa nhu cầu kinh doanh và triển khai kỹ thuật.</p><h2>Quy Trình Thu Thập Yêu Cầu</h2><p>Quy trình thường bao gồm:</p><ul><li>Phỏng vấn các bên liên quan</li><li>Xem xét tài liệu</li><li>Quan sát quy trình</li><li>Tạo điều kiện workshop</li><li>Phát triển prototype</li></ul><h2>Các Loại Yêu Cầu</h2><p>Yêu cầu kinh doanh có thể được phân loại thành:</p><ul><li>Yêu cầu chức năng</li><li>Yêu cầu phi chức năng</li><li>Quy tắc kinh doanh</li><li>User stories</li><li>Tiêu chí chấp nhận</li></ul><h2>Thách Thức Thường Gặp</h2><p>Một số thách thức tôi đã gặp phải:</p><ul><li>Yêu cầu không rõ ràng hoặc mâu thuẫn</li><li>Khoảng cách giao tiếp với các bên liên quan</li><li>Phạm vi mở rộng</li><li>Nhu cầu kinh doanh thay đổi</li><li>Ràng buộc kỹ thuật</li></ul><h2>Thực Hành Tốt Nhất</h2><p>Để đảm bảo thu thập yêu cầu thành công:</p><ul><li>Sử dụng ngôn ngữ rõ ràng, không mơ hồ</li><li>Xác thực yêu cầu với các bên liên quan</li><li>Tài liệu hóa giả định và ràng buộc</li><li>Tạo mô hình trực quan khi hữu ích</li><li>Duy trì khả năng truy xuất</li></ul><h2>Kết Luận</h2><p>Thu thập yêu cầu hiệu quả là một quá trình lặp lại đòi hỏi sự kiên nhẫn, kỹ năng giao tiếp và hiểu biết sâu sắc về cả lĩnh vực kinh doanh và kỹ thuật.</p>')
ON CONFLICT (blog_post_id, language_code) DO NOTHING;

-- Insert sample portfolio projects
INSERT INTO public.portfolio_projects (slug, status, project_url, github_url, technologies, published_at) 
VALUES 
  ('personal-blog-platform', 'published', 'https://example.com/blog', 'https://github.com/username/blog', ARRAY['Next.js', 'Supabase', 'Tailwind CSS'], '2024-01-15T00:00:00Z'),
  ('ecommerce-dashboard', 'published', 'https://example.com/dashboard', 'https://github.com/username/dashboard', ARRAY['React', 'Node.js', 'PostgreSQL'], '2024-01-10T00:00:00Z')
ON CONFLICT (slug) DO NOTHING;

-- Insert portfolio project translations
INSERT INTO public.portfolio_project_translations (portfolio_project_id, language_code, title, description, content) 
VALUES 
  -- English translations
  ((SELECT id FROM public.portfolio_projects WHERE slug = 'personal-blog-platform'), 'en', 
   'Personal Blog Platform', 
   'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS. Features rich text editing, markdown support, and admin panel.',
   'This project demonstrates a full-featured blog platform with authentication, admin panel, and SEO best practices.'),
  
  ((SELECT id FROM public.portfolio_projects WHERE slug = 'ecommerce-dashboard'), 'en', 
   'E-commerce Dashboard', 
   'A dashboard for managing products, orders, and analytics for an e-commerce platform. Built with React, Node.js, and PostgreSQL.',
   'This dashboard provides real-time analytics and management tools for e-commerce businesses.'),
  
  -- Vietnamese translations
  ((SELECT id FROM public.portfolio_projects WHERE slug = 'personal-blog-platform'), 'vi', 
   'Nền Tảng Blog Cá Nhân', 
   'Một nền tảng blog hiện đại, có thể tùy chỉnh được xây dựng với Next.js, Supabase và Tailwind CSS. Có tính năng chỉnh sửa văn bản phong phú, hỗ trợ markdown và bảng quản trị.',
   'Dự án này thể hiện một nền tảng blog đầy đủ tính năng với xác thực, bảng quản trị và thực hành SEO tốt nhất.'),
  
  ((SELECT id FROM public.portfolio_projects WHERE slug = 'ecommerce-dashboard'), 'vi', 
   'Bảng Điều Khiển Thương Mại Điện Tử', 
   'Một bảng điều khiển để quản lý sản phẩm, đơn hàng và phân tích cho nền tảng thương mại điện tử. Được xây dựng với React, Node.js và PostgreSQL.',
   'Bảng điều khiển này cung cấp phân tích thời gian thực và công cụ quản lý cho các doanh nghiệp thương mại điện tử.')
ON CONFLICT (portfolio_project_id, language_code) DO NOTHING;

-- Insert some tags
INSERT INTO public.tags (slug) 
VALUES 
  ('software-development'),
  ('web-development'),
  ('business-analysis'),
  ('technology'),
  ('career')
ON CONFLICT (slug) DO NOTHING;

-- Insert tag translations
INSERT INTO public.tag_translations (tag_id, language_code, name) 
VALUES 
  ((SELECT id FROM public.tags WHERE slug = 'software-development'), 'en', 'Software Development'),
  ((SELECT id FROM public.tags WHERE slug = 'software-development'), 'vi', 'Phát Triển Phần Mềm'),
  ((SELECT id FROM public.tags WHERE slug = 'web-development'), 'en', 'Web Development'),
  ((SELECT id FROM public.tags WHERE slug = 'web-development'), 'vi', 'Phát Triển Web'),
  ((SELECT id FROM public.tags WHERE slug = 'business-analysis'), 'en', 'Business Analysis'),
  ((SELECT id FROM public.tags WHERE slug = 'business-analysis'), 'vi', 'Phân Tích Kinh Doanh'),
  ((SELECT id FROM public.tags WHERE slug = 'technology'), 'en', 'Technology'),
  ((SELECT id FROM public.tags WHERE slug = 'technology'), 'vi', 'Công Nghệ'),
  ((SELECT id FROM public.tags WHERE slug = 'career'), 'en', 'Career'),
  ((SELECT id FROM public.tags WHERE slug = 'career'), 'vi', 'Sự Nghiệp')
ON CONFLICT (tag_id, language_code) DO NOTHING;

-- Link blog posts to tags
INSERT INTO public.blog_post_tags (blog_post_id, tag_id) 
VALUES 
  ((SELECT id FROM public.blog_posts WHERE slug = 'my-journey-in-software-development'), (SELECT id FROM public.tags WHERE slug = 'software-development')),
  ((SELECT id FROM public.blog_posts WHERE slug = 'my-journey-in-software-development'), (SELECT id FROM public.tags WHERE slug = 'career')),
  ((SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-web-applications'), (SELECT id FROM public.tags WHERE slug = 'web-development')),
  ((SELECT id FROM public.blog_posts WHERE slug = 'building-scalable-web-applications'), (SELECT id FROM public.tags WHERE slug = 'technology')),
  ((SELECT id FROM public.blog_posts WHERE slug = 'understanding-business-requirements'), (SELECT id FROM public.tags WHERE slug = 'business-analysis'))
ON CONFLICT (blog_post_id, tag_id) DO NOTHING; 