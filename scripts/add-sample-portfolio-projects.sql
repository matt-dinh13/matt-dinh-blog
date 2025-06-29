-- Add sample portfolio projects
INSERT INTO public.portfolio_projects (slug, thumbnail_url, project_url, github_url, technologies, status, published_at) VALUES
('e-commerce-platform', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop', 'https://example-ecommerce.com', 'https://github.com/username/ecommerce-platform', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'published', NOW()),
('task-management-app', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop', 'https://example-taskapp.com', 'https://github.com/username/task-management', ARRAY['Vue.js', 'Express', 'MongoDB', 'Socket.io'], 'published', NOW()),
('weather-dashboard', 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop', 'https://example-weather.com', 'https://github.com/username/weather-dashboard', ARRAY['React', 'TypeScript', 'OpenWeather API', 'Chart.js'], 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Add English translations for portfolio projects
INSERT INTO public.portfolio_project_translations (portfolio_project_id, language_code, title, description, content) 
SELECT 
    pp.id,
    'en',
    CASE 
        WHEN pp.slug = 'e-commerce-platform' THEN 'E-Commerce Platform'
        WHEN pp.slug = 'task-management-app' THEN 'Task Management Application'
        WHEN pp.slug = 'weather-dashboard' THEN 'Weather Dashboard'
    END,
    CASE 
        WHEN pp.slug = 'e-commerce-platform' THEN 'A full-stack e-commerce platform with payment processing, inventory management, and admin dashboard.'
        WHEN pp.slug = 'task-management-app' THEN 'Real-time task management application with team collaboration features and progress tracking.'
        WHEN pp.slug = 'weather-dashboard' THEN 'Interactive weather dashboard with location-based forecasts and historical data visualization.'
    END,
    CASE 
        WHEN pp.slug = 'e-commerce-platform' THEN '<h1>E-Commerce Platform</h1><p>A comprehensive e-commerce solution built with modern web technologies.</p><h2>Features</h2><ul><li>Product catalog with search and filtering</li><li>Secure payment processing with Stripe</li><li>Order management and tracking</li><li>Admin dashboard for inventory control</li></ul>'
        WHEN pp.slug = 'task-management-app' THEN '<h1>Task Management Application</h1><p>A collaborative task management platform for teams.</p><h2>Features</h2><ul><li>Real-time task updates</li><li>Team collaboration tools</li><li>Progress tracking and analytics</li><li>Mobile-responsive design</li></ul>'
        WHEN pp.slug = 'weather-dashboard' THEN '<h1>Weather Dashboard</h1><p>An interactive weather application with detailed forecasts.</p><h2>Features</h2><ul><li>Location-based weather data</li><li>Interactive charts and graphs</li><li>Historical weather analysis</li><li>Responsive design for all devices</li></ul>'
    END
FROM public.portfolio_projects pp
WHERE pp.slug IN ('e-commerce-platform', 'task-management-app', 'weather-dashboard')
ON CONFLICT (portfolio_project_id, language_code) DO NOTHING;

-- Add Vietnamese translations for portfolio projects
INSERT INTO public.portfolio_project_translations (portfolio_project_id, language_code, title, description, content) 
SELECT 
    pp.id,
    'vi',
    CASE 
        WHEN pp.slug = 'e-commerce-platform' THEN 'Nền Tảng Thương Mại Điện Tử'
        WHEN pp.slug = 'task-management-app' THEN 'Ứng Dụng Quản Lý Công Việc'
        WHEN pp.slug = 'weather-dashboard' THEN 'Bảng Điều Khiển Thời Tiết'
    END,
    CASE 
        WHEN pp.slug = 'e-commerce-platform' THEN 'Nền tảng thương mại điện tử đầy đủ với xử lý thanh toán, quản lý kho hàng và bảng điều khiển quản trị.'
        WHEN pp.slug = 'task-management-app' THEN 'Ứng dụng quản lý công việc thời gian thực với tính năng cộng tác nhóm và theo dõi tiến độ.'
        WHEN pp.slug = 'weather-dashboard' THEN 'Bảng điều khiển thời tiết tương tác với dự báo dựa trên vị trí và trực quan hóa dữ liệu lịch sử.'
    END,
    CASE 
        WHEN pp.slug = 'e-commerce-platform' THEN '<h1>Nền Tảng Thương Mại Điện Tử</h1><p>Giải pháp thương mại điện tử toàn diện được xây dựng với các công nghệ web hiện đại.</p><h2>Tính Năng</h2><ul><li>Danh mục sản phẩm với tìm kiếm và lọc</li><li>Xử lý thanh toán an toàn với Stripe</li><li>Quản lý đơn hàng và theo dõi</li><li>Bảng điều khiển quản trị cho kiểm soát kho hàng</li></ul>'
        WHEN pp.slug = 'task-management-app' THEN '<h1>Ứng Dụng Quản Lý Công Việc</h1><p>Nền tảng quản lý công việc cộng tác cho các nhóm.</p><h2>Tính Năng</h2><ul><li>Cập nhật công việc thời gian thực</li><li>Công cụ cộng tác nhóm</li><li>Theo dõi tiến độ và phân tích</li><li>Thiết kế đáp ứng di động</li></ul>'
        WHEN pp.slug = 'weather-dashboard' THEN '<h1>Bảng Điều Khiển Thời Tiết</h1><p>Ứng dụng thời tiết tương tác với dự báo chi tiết.</p><h2>Tính Năng</h2><ul><li>Dữ liệu thời tiết dựa trên vị trí</li><li>Biểu đồ và đồ thị tương tác</li><li>Phân tích thời tiết lịch sử</li><li>Thiết kế đáp ứng cho tất cả thiết bị</li></ul>'
    END
FROM public.portfolio_projects pp
WHERE pp.slug IN ('e-commerce-platform', 'task-management-app', 'weather-dashboard')
ON CONFLICT (portfolio_project_id, language_code) DO NOTHING;

-- Verify the data was inserted
SELECT 
    pp.slug,
    pp.status,
    ppt_en.title as title_en,
    ppt_vi.title as title_vi
FROM public.portfolio_projects pp
LEFT JOIN public.portfolio_project_translations ppt_en ON pp.id = ppt_en.portfolio_project_id AND ppt_en.language_code = 'en'
LEFT JOIN public.portfolio_project_translations ppt_vi ON pp.id = ppt_vi.portfolio_project_id AND ppt_vi.language_code = 'vi'
WHERE pp.slug IN ('e-commerce-platform', 'task-management-app', 'weather-dashboard'); 