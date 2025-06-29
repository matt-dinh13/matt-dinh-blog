-- Add 3 sample blog posts with multi-language support and thumbnails
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
    ('nextjs-15-guide', 'published', NOW() - INTERVAL '3 days', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'),
    ('vietnamese-street-food', 'published', NOW() - INTERVAL '2 days', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop'),
    ('responsive-design-tips', 'published', NOW() - INTERVAL '1 day', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- 3. Add English translations
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
    ((SELECT id FROM public.blog_posts WHERE slug = 'nextjs-15-guide'), 'en', 
     'Getting Started with Next.js 15', 
     'Learn how to build modern web applications with Next.js 15 and its new features.',
     '<h1>Getting Started with Next.js 15</h1><p>Next.js 15 brings exciting new features that make building modern web applications easier and more efficient than ever before.</p><h2>What''s New</h2><p>The latest version introduces several groundbreaking features:</p><ul><li><strong>App Router:</strong> A new file-system based router</li><li><strong>Server Components:</strong> React components that run on the server</li><li><strong>Streaming:</strong> Progressive rendering for better performance</li><li><strong>Turbopack:</strong> Faster bundling and development experience</li></ul><h2>Getting Started</h2><p>Getting started is simple:</p><pre><code>npx create-next-app@latest my-app --typescript --tailwind --app</code></pre><p>Next.js 15 offers improved performance, better developer experience, and enhanced SEO capabilities out of the box.</p>'),
    
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-street-food'), 'en', 
     'The Ultimate Guide to Vietnamese Street Food', 
     'Discover the best street food dishes in Vietnam, from pho and banh mi to lesser-known local favorites.',
     '<h1>The Ultimate Guide to Vietnamese Street Food</h1><p>Vietnamese street food is a culinary adventure that offers some of the most flavorful and affordable dining experiences in the world.</p><h2>Must-Try Dishes</h2><ul><li><strong>Pho:</strong> Vietnam''s national dish - aromatic beef noodle soup</li><li><strong>Banh Mi:</strong> French-inspired Vietnamese sandwich</li><li><strong>Bun Cha:</strong> Grilled pork with rice noodles</li><li><strong>Banh Xeo:</strong> Crispy Vietnamese crepes</li></ul><h2>Where to Find</h2><p>From bustling markets to quiet alleyways, street food vendors can be found throughout Vietnam, each offering their unique take on classic dishes.</p>'),
    
    ((SELECT id FROM public.blog_posts WHERE slug = 'responsive-design-tips'), 'en', 
     'Building Responsive Designs: From Mobile to Desktop', 
     'Learn the principles and techniques for creating beautiful, responsive web designs that work on all devices.',
     '<h1>Building Responsive Designs: From Mobile to Desktop</h1><p>Responsive design is no longer optional - it''s essential for modern web development. Here''s how to create designs that look great on any device.</p><h2>Core Principles</h2><ul><li><strong>Mobile-First:</strong> Design for mobile devices first, then enhance for larger screens</li><li><strong>Flexible Grids:</strong> Use CSS Grid and Flexbox for adaptable layouts</li><li><strong>Responsive Images:</strong> Optimize images for different screen sizes</li><li><strong>Touch-Friendly:</strong> Ensure interactive elements are easy to use on touch devices</li></ul><h2>Implementation Tips</h2><p>Use CSS media queries, viewport meta tags, and modern CSS features to create truly responsive experiences.</p>');

-- 4. Add Vietnamese translations
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
    ((SELECT id FROM public.blog_posts WHERE slug = 'nextjs-15-guide'), 'vi', 
     'Bắt Đầu Với Next.js 15', 
     'Học cách xây dựng ứng dụng web hiện đại với Next.js 15 và các tính năng mới.',
     '<h1>Bắt Đầu Với Next.js 15</h1><p>Next.js 15 mang đến những tính năng mới thú vị giúp xây dựng ứng dụng web hiện đại dễ dàng và hiệu quả hơn bao giờ hết.</p><h2>Những Gì Mới</h2><p>Phiên bản mới nhất giới thiệu một số tính năng đột phá:</p><ul><li><strong>App Router:</strong> Router dựa trên hệ thống tệp mới</li><li><strong>Server Components:</strong> React components chạy trên server</li><li><strong>Streaming:</strong> Render tiến bộ để cải thiện hiệu suất</li><li><strong>Turbopack:</strong> Trải nghiệm bundling và phát triển nhanh hơn</li></ul><h2>Bắt Đầu</h2><p>Bắt đầu rất đơn giản:</p><pre><code>npx create-next-app@latest my-app --typescript --tailwind --app</code></pre><p>Next.js 15 cung cấp hiệu suất cải thiện, trải nghiệm nhà phát triển tốt hơn và khả năng SEO nâng cao ngay từ đầu.</p>'),
    
    ((SELECT id FROM public.blog_posts WHERE slug = 'vietnamese-street-food'), 'vi', 
     'Hướng Dẫn Đầy Đủ Về Ẩm Thực Đường Phố Việt Nam', 
     'Khám phá những món ăn đường phố ngon nhất ở Việt Nam, từ phở và bánh mì đến những món địa phương ít người biết.',
     '<h1>Hướng Dẫn Đầy Đủ Về Ẩm Thực Đường Phố Việt Nam</h1><p>Ẩm thực đường phố Việt Nam là một cuộc phiêu lưu ẩm thực mang đến những trải nghiệm ăn uống ngon nhất và giá cả phải chăng nhất thế giới.</p><h2>Những Món Phải Thử</h2><ul><li><strong>Phở:</strong> Món ăn quốc gia của Việt Nam - súp bò với bánh phở thơm ngon</li><li><strong>Bánh Mì:</strong> Bánh mì Việt Nam lấy cảm hứng từ Pháp</li><li><strong>Bún Chả:</strong> Thịt nướng với bún</li><li><strong>Bánh Xèo:</strong> Bánh xèo Việt Nam giòn rụm</li></ul><h2>Nơi Tìm</h2><p>Từ các chợ nhộn nhịp đến những con hẻm yên tĩnh, các quán ăn đường phố có thể được tìm thấy khắp Việt Nam, mỗi nơi mang đến cách chế biến độc đáo cho những món ăn cổ điển.</p>'),
    
    ((SELECT id FROM public.blog_posts WHERE slug = 'responsive-design-tips'), 'vi', 
     'Xây Dựng Thiết Kế Responsive: Từ Mobile Đến Desktop', 
     'Học các nguyên tắc và kỹ thuật để tạo ra những thiết kế web responsive đẹp mắt hoạt động trên mọi thiết bị.',
     '<h1>Xây Dựng Thiết Kế Responsive: Từ Mobile Đến Desktop</h1><p>Thiết kế responsive không còn là tùy chọn - nó là điều cần thiết cho phát triển web hiện đại. Đây là cách tạo ra những thiết kế trông đẹp trên mọi thiết bị.</p><h2>Nguyên Tắc Cốt Lõi</h2><ul><li><strong>Mobile-First:</strong> Thiết kế cho thiết bị di động trước, sau đó cải thiện cho màn hình lớn hơn</li><li><strong>Grid Linh Hoạt:</strong> Sử dụng CSS Grid và Flexbox cho layout thích ứng</li><li><strong>Hình Ảnh Responsive:</strong> Tối ưu hóa hình ảnh cho các kích thước màn hình khác nhau</li><li><strong>Thân Thiện Với Cảm Ứng:</strong> Đảm bảo các phần tử tương tác dễ sử dụng trên thiết bị cảm ứng</li></ul><h2>Mẹo Triển Khai</h2><p>Sử dụng CSS media queries, viewport meta tags và các tính năng CSS hiện đại để tạo ra trải nghiệm thực sự responsive.</p>');

-- 5. Verify the data was added
SELECT 'Sample blog posts added successfully!' as message;
SELECT 'Total posts:' as info, COUNT(*) as count FROM public.blog_posts;
SELECT 'Total translations:' as info, COUNT(*) as count FROM public.blog_post_translations;
SELECT 'Posts with thumbnails:' as info, COUNT(*) as count FROM public.blog_posts WHERE thumbnail_url IS NOT NULL; 