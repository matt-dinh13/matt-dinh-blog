-- Add 10 sample blog posts with multi-language support and thumbnails
-- Run this in your Supabase SQL Editor

-- 1. Add languages if they don't exist
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES 
    ('en', 'English', 'English', true),
    ('vi', 'Vietnamese', 'Tiếng Việt', false)
ON CONFLICT (code) DO NOTHING;

-- 2. Add sample blog posts with thumbnails
INSERT INTO public.blog_posts (slug, status, published_at, thumbnail_url) 
VALUES 
    ('getting-started-with-nextjs-15', 'published', NOW() - INTERVAL '10 days', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'),
    ('vietnamese-street-food-guide', 'published', NOW() - INTERVAL '9 days', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop'),
    ('building-responsive-designs', 'published', NOW() - INTERVAL '8 days', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop'),
    ('ho-chi-minh-city-travel-tips', 'published', NOW() - INTERVAL '7 days', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'),
    ('supabase-authentication-guide', 'published', NOW() - INTERVAL '6 days', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop'),
    ('vietnamese-coffee-culture', 'published', NOW() - INTERVAL '5 days', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop'),
    ('typescript-best-practices', 'published', NOW() - INTERVAL '4 days', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'),
    ('hanoi-old-quarter-exploration', 'published', NOW() - INTERVAL '3 days', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'),
    ('web-performance-optimization', 'published', NOW() - INTERVAL '2 days', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'),
    ('vietnamese-pho-recipe', 'published', NOW() - INTERVAL '1 day', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- 3. Add English translations (with properly escaped apostrophes)
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
    -- 1. Next.js 15 Guide
    ((SELECT id FROM public.blog_posts WHERE slug = 'getting-started-with-nextjs-15'), 'en', 
     'Getting Started with Next.js 15: A Complete Guide', 
     'Learn how to build modern web applications with Next.js 15, including new features like the App Router, Server Components, and more.',
     '<h1>Getting Started with Next.js 15: A Complete Guide</h1><p>Next.js 15 brings exciting new features that make building modern web applications easier and more efficient than ever before.</p><h2>What''s New in Next.js 15</h2><p>The latest version introduces several groundbreaking features:</p><ul><li><strong>App Router:</strong> A new file-system based router that simplifies routing</li><li><strong>Server Components:</strong> React components that run on the server</li><li><strong>Streaming:</strong> Progressive rendering for better performance</li><li><strong>Turbopack:</strong> Faster bundling and development experience</li></ul><h2>Setting Up Your First Project</h2><p>Getting started is simple:</p><pre><code>npx create-next-app@latest my-app --typescript --tailwind --app</code></pre><h2>Key Benefits</h2><p>Next.js 15 offers improved performance, better developer experience, and enhanced SEO capabilities out of the box.</p>'),
    
    -- 2. Vietnamese Street Food
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-street-food-guide'), 'en', 
     'The Ultimate Guide to Vietnamese Street Food', 
     'Discover the best street food dishes in Vietnam, from pho and banh mi to lesser-known local favorites.',
     '<h1>The Ultimate Guide to Vietnamese Street Food</h1><p>Vietnamese street food is a culinary adventure that offers some of the most flavorful and affordable dining experiences in the world.</p><h2>Must-Try Street Food Dishes</h2><ul><li><strong>Pho:</strong> Vietnam''s national dish - aromatic beef noodle soup</li><li><strong>Banh Mi:</strong> French-inspired Vietnamese sandwich</li><li><strong>Bun Cha:</strong> Grilled pork with rice noodles</li><li><strong>Banh Xeo:</strong> Crispy Vietnamese crepes</li></ul><h2>Where to Find the Best Street Food</h2><p>From bustling markets to quiet alleyways, street food vendors can be found throughout Vietnam, each offering their unique take on classic dishes.</p>'),
    
    -- 3. Responsive Design
    ((SELECT id FROM public.blog_posts WHERE slug = 'building-responsive-designs'), 'en', 
     'Building Responsive Designs: From Mobile to Desktop', 
     'Learn the principles and techniques for creating beautiful, responsive web designs that work on all devices.',
     '<h1>Building Responsive Designs: From Mobile to Desktop</h1><p>Responsive design is no longer optional - it''s essential for modern web development. Here''s how to create designs that look great on any device.</p><h2>Core Principles</h2><ul><li><strong>Mobile-First:</strong> Design for mobile devices first, then enhance for larger screens</li><li><strong>Flexible Grids:</strong> Use CSS Grid and Flexbox for adaptable layouts</li><li><strong>Responsive Images:</strong> Optimize images for different screen sizes</li><li><strong>Touch-Friendly:</strong> Ensure interactive elements are easy to use on touch devices</li></ul><h2>Implementation Tips</h2><p>Use CSS media queries, viewport meta tags, and modern CSS features to create truly responsive experiences.</p>'),
    
    -- 4. Ho Chi Minh City Travel
    ((SELECT id FROM public.blog_posts WHERE slug = 'ho-chi-minh-city-travel-tips'), 'en', 
     'Ho Chi Minh City Travel Guide: 48 Hours in Saigon', 
     'Make the most of your time in Vietnam''s largest city with this comprehensive 48-hour travel guide.',
     '<h1>Ho Chi Minh City Travel Guide: 48 Hours in Saigon</h1><p>Ho Chi Minh City, formerly known as Saigon, is a vibrant metropolis that perfectly blends history, culture, and modernity.</p><h2>Day 1: Historical Saigon</h2><ul><li>Visit the War Remnants Museum</li><li>Explore the Reunification Palace</li><li>Walk through Notre-Dame Cathedral</li><li>Shop at Ben Thanh Market</li></ul><h2>Day 2: Modern Saigon</h2><ul><li>Visit the Bitexco Financial Tower</li><li>Explore District 1''s modern architecture</li><li>Enjoy rooftop bars and restaurants</li><li>Experience the nightlife in Bui Vien Street</li></ul>'),
    
    -- 5. Supabase Authentication
    ((SELECT id FROM public.blog_posts WHERE slug = 'supabase-authentication-guide'), 'en', 
     'Complete Guide to Supabase Authentication', 
     'Learn how to implement secure authentication in your applications using Supabase''s powerful auth system.',
     '<h1>Complete Guide to Supabase Authentication</h1><p>Supabase provides a comprehensive authentication system that makes it easy to add user management to your applications.</p><h2>Authentication Methods</h2><ul><li><strong>Email/Password:</strong> Traditional authentication</li><li><strong>Social Logins:</strong> Google, GitHub, Facebook, and more</li><li><strong>Magic Links:</strong> Passwordless authentication</li><li><strong>Phone Auth:</strong> SMS-based verification</li></ul><h2>Implementation Steps</h2><p>From setup to deployment, learn how to integrate Supabase auth into your Next.js applications with proper security practices.</p>'),
    
    -- 6. Vietnamese Coffee
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-coffee-culture'), 'en', 
     'Vietnamese Coffee Culture: Beyond the Basics', 
     'Explore the rich coffee culture of Vietnam, from traditional brewing methods to modern coffee shops.',
     '<h1>Vietnamese Coffee Culture: Beyond the Basics</h1><p>Vietnam is the world''s second-largest coffee producer, and its coffee culture is as rich and diverse as the country itself.</p><h2>Traditional Vietnamese Coffee</h2><ul><li><strong>Ca Phe Sua Da:</strong> Iced coffee with condensed milk</li><li><strong>Ca Phe Trung:</strong> Egg coffee - a Hanoi specialty</li><li><strong>Ca Phe Chon:</strong> Weasel coffee - a luxury variety</li></ul><h2>Modern Coffee Scene</h2><p>From traditional street vendors to modern specialty coffee shops, Vietnam''s coffee culture continues to evolve while preserving its heritage.</p>'),
    
    -- 7. TypeScript Best Practices
    ((SELECT id FROM public.blog_posts WHERE slug = 'typescript-best-practices'), 'en', 
     'TypeScript Best Practices for 2024', 
     'Master TypeScript with these essential best practices that will improve your code quality and developer experience.',
     '<h1>TypeScript Best Practices for 2024</h1><p>TypeScript has become the standard for large-scale JavaScript applications. Here are the best practices to follow in 2024.</p><h2>Type Safety Best Practices</h2><ul><li><strong>Strict Mode:</strong> Enable strict TypeScript configuration</li><li><strong>Type Definitions:</strong> Create comprehensive type definitions</li><li><strong>Generic Types:</strong> Use generics for reusable components</li><li><strong>Union Types:</strong> Leverage union types for better type safety</li></ul><h2>Code Organization</h2><p>Learn how to structure your TypeScript projects for maintainability and scalability.</p>'),
    
    -- 8. Hanoi Old Quarter
    ((SELECT id FROM public.blog_posts WHERE slug = 'hanoi-old-quarter-exploration'), 'en', 
     'Exploring Hanoi''s Old Quarter: A Walking Guide', 
     'Discover the charm and history of Hanoi''s Old Quarter with this detailed walking guide.',
     '<h1>Exploring Hanoi''s Old Quarter: A Walking Guide</h1><p>Hanoi''s Old Quarter is a maze of narrow streets, each named after the goods traditionally sold there.</p><h2>Historical Significance</h2><p>The Old Quarter has been the commercial heart of Hanoi for over 1,000 years, with its unique architecture and bustling atmosphere.</p><h2>Must-Visit Streets</h2><ul><li><strong>Hang Gai:</strong> Silk street with traditional shops</li><li><strong>Hang Bac:</strong> Silver street with jewelry shops</li><li><strong>Hang Ma:</strong> Paper street with traditional decorations</li><li><strong>Ta Hien:</strong> Famous for its beer culture</li></ul>'),
    
    -- 9. Web Performance
    ((SELECT id FROM public.blog_posts WHERE slug = 'web-performance-optimization'), 'en', 
     'Web Performance Optimization: A Developer''s Guide', 
     'Learn essential techniques for optimizing web performance and improving user experience.',
     '<h1>Web Performance Optimization: A Developer''s Guide</h1><p>Performance is crucial for user experience and SEO. Here''s how to optimize your web applications for speed.</p><h2>Key Optimization Techniques</h2><ul><li><strong>Image Optimization:</strong> Compress and serve appropriate image formats</li><li><strong>Code Splitting:</strong> Load only necessary JavaScript</li><li><strong>Caching Strategies:</strong> Implement effective caching policies</li><li><strong>CDN Usage:</strong> Distribute content globally</li></ul><h2>Performance Monitoring</h2><p>Use tools like Lighthouse, WebPageTest, and Core Web Vitals to measure and improve performance.</p>'),
    
    -- 10. Vietnamese Pho Recipe
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-pho-recipe'), 'en', 
     'Authentic Vietnamese Pho Recipe: From Broth to Bowl', 
     'Learn to make authentic Vietnamese pho at home with this detailed recipe and cooking tips.',
     '<h1>Authentic Vietnamese Pho Recipe: From Broth to Bowl</h1><p>Pho is more than just a soup - it''s a cultural experience that represents the heart of Vietnamese cuisine.</p><h2>The Perfect Broth</h2><p>The secret to great pho lies in the broth, which requires hours of simmering with aromatic spices and beef bones.</p><h2>Essential Ingredients</h2><ul><li><strong>Beef bones:</strong> For rich, flavorful broth</li><li><strong>Rice noodles:</strong> Flat, white rice noodles</li><li><strong>Fresh herbs:</strong> Thai basil, cilantro, mint</li><li><strong>Bean sprouts:</strong> For crunch and freshness</li></ul><h2>Cooking Tips</h2><p>From selecting the right cuts of meat to achieving the perfect noodle texture, learn the techniques that make pho truly special.</p>');

-- 4. Add Vietnamese translations (with properly escaped apostrophes)
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
    -- 1. Next.js 15 Guide
    ((SELECT id FROM public.blog_posts WHERE slug = 'getting-started-with-nextjs-15'), 'vi', 
     'Bắt Đầu Với Next.js 15: Hướng Dẫn Hoàn Chỉnh', 
     'Học cách xây dựng ứng dụng web hiện đại với Next.js 15, bao gồm các tính năng mới như App Router, Server Components và nhiều hơn nữa.',
     '<h1>Bắt Đầu Với Next.js 15: Hướng Dẫn Hoàn Chỉnh</h1><p>Next.js 15 mang đến những tính năng mới thú vị giúp xây dựng ứng dụng web hiện đại dễ dàng và hiệu quả hơn bao giờ hết.</p><h2>Những Gì Mới Trong Next.js 15</h2><p>Phiên bản mới nhất giới thiệu một số tính năng đột phá:</p><ul><li><strong>App Router:</strong> Router dựa trên hệ thống tệp mới giúp đơn giản hóa routing</li><li><strong>Server Components:</strong> React components chạy trên server</li><li><strong>Streaming:</strong> Render tiến bộ để cải thiện hiệu suất</li><li><strong>Turbopack:</strong> Trải nghiệm bundling và phát triển nhanh hơn</li></ul><h2>Thiết Lập Dự Án Đầu Tiên</h2><p>Bắt đầu rất đơn giản:</p><pre><code>npx create-next-app@latest my-app --typescript --tailwind --app</code></pre><h2>Lợi Ích Chính</h2><p>Next.js 15 cung cấp hiệu suất cải thiện, trải nghiệm nhà phát triển tốt hơn và khả năng SEO nâng cao ngay từ đầu.</p>'),
    
    -- 2. Vietnamese Street Food
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-street-food-guide'), 'vi', 
     'Hướng Dẫn Đầy Đủ Về Ẩm Thực Đường Phố Việt Nam', 
     'Khám phá những món ăn đường phố ngon nhất ở Việt Nam, từ phở và bánh mì đến những món địa phương ít người biết.',
     '<h1>Hướng Dẫn Đầy Đủ Về Ẩm Thực Đường Phố Việt Nam</h1><p>Ẩm thực đường phố Việt Nam là một cuộc phiêu lưu ẩm thực mang đến những trải nghiệm ăn uống ngon nhất và giá cả phải chăng nhất thế giới.</p><h2>Những Món Ăn Đường Phố Phải Thử</h2><ul><li><strong>Phở:</strong> Món ăn quốc gia của Việt Nam - súp bò với bánh phở thơm ngon</li><li><strong>Bánh Mì:</strong> Bánh mì Việt Nam lấy cảm hứng từ Pháp</li><li><strong>Bún Chả:</strong> Thịt nướng với bún</li><li><strong>Bánh Xèo:</strong> Bánh xèo Việt Nam giòn rụm</li></ul><h2>Nơi Tìm Món Ăn Đường Phố Ngon Nhất</h2><p>Từ các chợ nhộn nhịp đến những con hẻm yên tĩnh, các quán ăn đường phố có thể được tìm thấy khắp Việt Nam, mỗi nơi mang đến cách chế biến độc đáo cho những món ăn cổ điển.</p>'),
    
    -- 3. Responsive Design
    ((SELECT id FROM public.blog_posts WHERE slug = 'building-responsive-designs'), 'vi', 
     'Xây Dựng Thiết Kế Responsive: Từ Mobile Đến Desktop', 
     'Học các nguyên tắc và kỹ thuật để tạo ra những thiết kế web responsive đẹp mắt hoạt động trên mọi thiết bị.',
     '<h1>Xây Dựng Thiết Kế Responsive: Từ Mobile Đến Desktop</h1><p>Thiết kế responsive không còn là tùy chọn - nó là điều cần thiết cho phát triển web hiện đại. Đây là cách tạo ra những thiết kế trông đẹp trên mọi thiết bị.</p><h2>Nguyên Tắc Cốt Lõi</h2><ul><li><strong>Mobile-First:</strong> Thiết kế cho thiết bị di động trước, sau đó cải thiện cho màn hình lớn hơn</li><li><strong>Grid Linh Hoạt:</strong> Sử dụng CSS Grid và Flexbox cho layout thích ứng</li><li><strong>Hình Ảnh Responsive:</strong> Tối ưu hóa hình ảnh cho các kích thước màn hình khác nhau</li><li><strong>Thân Thiện Với Cảm Ứng:</strong> Đảm bảo các phần tử tương tác dễ sử dụng trên thiết bị cảm ứng</li></ul><h2>Mẹo Triển Khai</h2><p>Sử dụng CSS media queries, viewport meta tags và các tính năng CSS hiện đại để tạo ra trải nghiệm thực sự responsive.</p>'),
    
    -- 4. Ho Chi Minh City Travel
    ((SELECT id FROM public.blog_posts WHERE slug = 'ho-chi-minh-city-travel-tips'), 'vi', 
     'Hướng Dẫn Du Lịch TP.HCM: 48 Giờ Ở Sài Gòn', 
     'Tận dụng tối đa thời gian ở thành phố lớn nhất Việt Nam với hướng dẫn du lịch toàn diện này.',
     '<h1>Hướng Dẫn Du Lịch TP.HCM: 48 Giờ Ở Sài Gòn</h1><p>Thành phố Hồ Chí Minh, trước đây được gọi là Sài Gòn, là một đô thị sôi động kết hợp hoàn hảo giữa lịch sử, văn hóa và hiện đại.</p><h2>Ngày 1: Sài Gòn Lịch Sử</h2><ul><li>Thăm Bảo tàng Chứng tích Chiến tranh</li><li>Khám phá Dinh Thống Nhất</li><li>Đi bộ qua Nhà thờ Đức Bà</li><li>Mua sắm tại Chợ Bến Thành</li></ul><h2>Ngày 2: Sài Gòn Hiện Đại</h2><ul><li>Thăm Tòa nhà Bitexco Financial Tower</li><li>Khám phá kiến trúc hiện đại của Quận 1</li><li>Thưởng thức các quán bar và nhà hàng trên tầng thượng</li><li>Trải nghiệm cuộc sống về đêm tại phố Bùi Viện</li></ul>'),
    
    -- 5. Supabase Authentication
    ((SELECT id FROM public.blog_posts WHERE slug = 'supabase-authentication-guide'), 'vi', 
     'Hướng Dẫn Hoàn Chỉnh Về Xác Thực Supabase', 
     'Học cách triển khai hệ thống xác thực an toàn trong ứng dụng của bạn bằng hệ thống auth mạnh mẽ của Supabase.',
     '<h1>Hướng Dẫn Hoàn Chỉnh Về Xác Thực Supabase</h1><p>Supabase cung cấp một hệ thống xác thực toàn diện giúp dễ dàng thêm quản lý người dùng vào ứng dụng của bạn.</p><h2>Phương Thức Xác Thực</h2><ul><li><strong>Email/Mật khẩu:</strong> Xác thực truyền thống</li><li><strong>Đăng nhập xã hội:</strong> Google, GitHub, Facebook và nhiều hơn nữa</li><li><strong>Magic Links:</strong> Xác thực không mật khẩu</li><li><strong>Xác thực điện thoại:</strong> Xác minh qua SMS</li></ul><h2>Các Bước Triển Khai</h2><p>Từ thiết lập đến triển khai, học cách tích hợp Supabase auth vào ứng dụng Next.js với các thực hành bảo mật phù hợp.</p>'),
    
    -- 6. Vietnamese Coffee
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-coffee-culture'), 'vi', 
     'Văn Hóa Cà Phê Việt Nam: Vượt Ra Ngoài Những Điều Cơ Bản', 
     'Khám phá văn hóa cà phê phong phú của Việt Nam, từ phương pháp pha truyền thống đến các quán cà phê hiện đại.',
     '<h1>Văn Hóa Cà Phê Việt Nam: Vượt Ra Ngoài Những Điều Cơ Bản</h1><p>Việt Nam là nhà sản xuất cà phê lớn thứ hai thế giới, và văn hóa cà phê của nước này phong phú và đa dạng như chính đất nước.</p><h2>Cà Phê Việt Nam Truyền Thống</h2><ul><li><strong>Cà Phê Sữa Đá:</strong> Cà phê đá với sữa đặc</li><li><strong>Cà Phê Trứng:</strong> Cà phê trứng - đặc sản Hà Nội</li><li><strong>Cà Phê Chồn:</strong> Cà phê chồn - một loại cà phê cao cấp</li></ul><h2>Không Gian Cà Phê Hiện Đại</h2><p>Từ các quán cà phê đường phố truyền thống đến các quán cà phê đặc biệt hiện đại, văn hóa cà phê Việt Nam tiếp tục phát triển trong khi bảo tồn di sản của mình.</p>'),
    
    -- 7. TypeScript Best Practices
    ((SELECT id FROM public.blog_posts WHERE slug = 'typescript-best-practices'), 'vi', 
     'Thực Hành Tốt Nhất Với TypeScript Cho Năm 2024', 
     'Làm chủ TypeScript với những thực hành tốt nhất cần thiết này sẽ cải thiện chất lượng code và trải nghiệm nhà phát triển của bạn.',
     '<h1>Thực Hành Tốt Nhất Với TypeScript Cho Năm 2024</h1><p>TypeScript đã trở thành tiêu chuẩn cho các ứng dụng JavaScript quy mô lớn. Đây là những thực hành tốt nhất cần tuân theo trong năm 2024.</p><h2>Thực Hành Tốt Nhất Về Type Safety</h2><ul><li><strong>Chế Độ Strict:</strong> Bật cấu hình TypeScript nghiêm ngặt</li><li><strong>Định Nghĩa Type:</strong> Tạo định nghĩa type toàn diện</li><li><strong>Generic Types:</strong> Sử dụng generics cho các component có thể tái sử dụng</li><li><strong>Union Types:</strong> Tận dụng union types để có type safety tốt hơn</li></ul><h2>Tổ Chức Code</h2><p>Học cách cấu trúc dự án TypeScript để dễ bảo trì và mở rộng.</p>'),
    
    -- 8. Hanoi Old Quarter
    ((SELECT id FROM public.blog_posts WHERE slug = 'hanoi-old-quarter-exploration'), 'vi', 
     'Khám Phá Phố Cổ Hà Nội: Hướng Dẫn Đi Bộ', 
     'Khám phá sự quyến rũ và lịch sử của Phố Cổ Hà Nội với hướng dẫn đi bộ chi tiết này.',
     '<h1>Khám Phá Phố Cổ Hà Nội: Hướng Dẫn Đi Bộ</h1><p>Phố Cổ Hà Nội là một mê cung của những con phố hẹp, mỗi phố được đặt tên theo hàng hóa truyền thống được bán ở đó.</p><h2>Ý Nghĩa Lịch Sử</h2><p>Phố Cổ đã là trung tâm thương mại của Hà Nội trong hơn 1.000 năm, với kiến trúc độc đáo và không khí nhộn nhịp.</p><h2>Những Con Phố Phải Ghé Thăm</h2><ul><li><strong>Hàng Gai:</strong> Phố lụa với các cửa hàng truyền thống</li><li><strong>Hàng Bạc:</strong> Phố bạc với các cửa hàng trang sức</li><li><strong>Hàng Mã:</strong> Phố giấy với đồ trang trí truyền thống</li><li><strong>Tạ Hiện:</strong> Nổi tiếng với văn hóa bia hơi</li></ul>'),
    
    -- 9. Web Performance
    ((SELECT id FROM public.blog_posts WHERE slug = 'web-performance-optimization'), 'vi', 
     'Tối Ưu Hóa Hiệu Suất Web: Hướng Dẫn Cho Nhà Phát Triển', 
     'Học các kỹ thuật cần thiết để tối ưu hóa hiệu suất web và cải thiện trải nghiệm người dùng.',
     '<h1>Tối Ưu Hóa Hiệu Suất Web: Hướng Dẫn Cho Nhà Phát Triển</h1><p>Hiệu suất rất quan trọng cho trải nghiệm người dùng và SEO. Đây là cách tối ưu hóa ứng dụng web của bạn để có tốc độ nhanh.</p><h2>Kỹ Thuật Tối Ưu Hóa Chính</h2><ul><li><strong>Tối Ưu Hóa Hình Ảnh:</strong> Nén và phục vụ định dạng hình ảnh phù hợp</li><li><strong>Code Splitting:</strong> Chỉ tải JavaScript cần thiết</li><li><strong>Chiến Lược Cache:</strong> Triển khai chính sách cache hiệu quả</li><li><strong>Sử Dụng CDN:</strong> Phân phối nội dung toàn cầu</li></ul><h2>Theo Dõi Hiệu Suất</h2><p>Sử dụng các công cụ như Lighthouse, WebPageTest và Core Web Vitals để đo lường và cải thiện hiệu suất.</p>'),
    
    -- 10. Vietnamese Pho Recipe
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-pho-recipe'), 'vi', 
     'Công Thức Phở Việt Nam Chính Gốc: Từ Nước Dùng Đến Bát Phở', 
     'Học cách làm phở Việt Nam chính gốc tại nhà với công thức chi tiết và mẹo nấu ăn này.',
     '<h1>Công Thức Phở Việt Nam Chính Gốc: Từ Nước Dùng Đến Bát Phở</h1><p>Phở không chỉ là một món súp - đó là một trải nghiệm văn hóa đại diện cho trái tim của ẩm thực Việt Nam.</p><h2>Nước Dùng Hoàn Hảo</h2><p>Bí quyết của phở ngon nằm ở nước dùng, cần nhiều giờ ninh với các loại gia vị thơm và xương bò.</p><h2>Nguyên Liệu Cần Thiết</h2><ul><li><strong>Xương bò:</strong> Cho nước dùng đậm đà, thơm ngon</li><li><strong>Bánh phở:</strong> Bánh phở gạo trắng, dẹt</li><li><strong>Rau thơm:</strong> Húng quế, rau mùi, bạc hà</li><li><strong>Giá đỗ:</strong> Cho độ giòn và tươi mới</li></ul><h2>Mẹo Nấu Ăn</h2><p>Từ việc chọn đúng phần thịt đến đạt được độ dai hoàn hảo của bánh phở, học các kỹ thuật làm cho phở thực sự đặc biệt.</p>');

-- 5. Verify the data was added
SELECT 'Sample blog posts added successfully!' as message;
SELECT 'Total posts:' as info, COUNT(*) as count FROM public.blog_posts;
SELECT 'Total translations:' as info, COUNT(*) as count FROM public.blog_post_translations;
SELECT 'Posts with thumbnails:' as info, COUNT(*) as count FROM public.blog_posts WHERE thumbnail_url IS NOT NULL; 