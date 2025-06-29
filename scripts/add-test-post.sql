-- Add a test blog post that can be accessed via URL
-- Run this in your Supabase SQL Editor

-- 1. Add languages if they don't exist
INSERT INTO public.languages (code, name, native_name, is_default) 
VALUES 
    ('en', 'English', 'English', true),
    ('vi', 'Vietnamese', 'Tiếng Việt', false)
ON CONFLICT (code) DO NOTHING;

-- 2. Add a test blog post with a specific slug
INSERT INTO public.blog_posts (slug, status, published_at) 
VALUES ('test-post', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 3. Add translations for the test post
INSERT INTO public.blog_post_translations (blog_post_id, language_code, title, summary, content) 
VALUES 
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'test-post'), 
        'en', 
        'Test Blog Post - Welcome to My Blog', 
        'This is a test post to verify that your blog post page is working correctly.',
        '<h1>Welcome to My Blog!</h1><p>This is a test post to verify that your blog post page is working correctly. If you can see this content, it means your Supabase connection and blog post page are both working!</p><h2>What this means</h2><p>Your blog system is now fully functional with:</p><ul><li>✅ Supabase database connection</li><li>✅ Blog post fetching</li><li>✅ Translation support</li><li>✅ Individual blog post pages</li></ul><h2>Next steps</h2><p>You can now:</p><ul><li>Add more posts through the admin panel</li><li>Create posts directly in the database</li><li>Add Vietnamese translations</li><li>Customize the styling</li></ul><p>Congratulations on getting your blog working!</p>'
    ),
    (
        (SELECT id FROM public.blog_posts WHERE slug = 'test-post'), 
        'vi', 
        'Bài Viết Thử Nghiệm - Chào Mừng Đến Với Blog Của Tôi', 
        'Đây là bài viết thử nghiệm để kiểm tra xem trang bài viết blog của bạn có hoạt động đúng không.',
        '<h1>Chào Mừng Đến Với Blog Của Tôi!</h1><p>Đây là bài viết thử nghiệm để kiểm tra xem trang bài viết blog của bạn có hoạt động đúng không. Nếu bạn có thể thấy nội dung này, điều đó có nghĩa là kết nối Supabase và trang bài viết blog của bạn đều đang hoạt động!</p><h2>Điều này có nghĩa gì</h2><p>Hệ thống blog của bạn hiện đã hoàn toàn hoạt động với:</p><ul><li>✅ Kết nối cơ sở dữ liệu Supabase</li><li>✅ Lấy dữ liệu bài viết blog</li><li>✅ Hỗ trợ đa ngôn ngữ</li><li>✅ Trang bài viết blog riêng lẻ</li></ul><h2>Bước tiếp theo</h2><p>Bây giờ bạn có thể:</p><ul><li>Thêm nhiều bài viết hơn thông qua bảng quản trị</li><li>Tạo bài viết trực tiếp trong cơ sở dữ liệu</li><li>Thêm bản dịch tiếng Việt</li><li>Tùy chỉnh giao diện</li></ul><p>Chúc mừng bạn đã làm cho blog hoạt động!</p>'
    )
ON CONFLICT (blog_post_id, language_code) DO NOTHING;

-- 4. Verify the data was added
SELECT 'Test post added successfully!' as message;
SELECT 'Post:' as info, slug, status FROM public.blog_posts WHERE slug = 'test-post';
SELECT 'Translations:' as info, bpt.language_code, bpt.title FROM public.blog_post_translations bpt 
JOIN public.blog_posts bp ON bpt.blog_post_id = bp.id 
WHERE bp.slug = 'test-post'; 