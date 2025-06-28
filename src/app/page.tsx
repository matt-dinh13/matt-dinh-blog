'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

// Dummy bilingual article
const mockPosts = [
  {
    id: 1,
    title_vi: 'Hành trình học lập trình của tôi',
    excerpt_vi: 'Chia sẻ về quá trình học lập trình, những khó khăn và bài học tôi đã trải qua.',
    title_en: 'My Programming Journey',
    excerpt_en: 'Sharing my programming journey, the challenges, and lessons I have learned.',
    category: 'Career',
    tags: ['Programming', 'Journey', 'Learning'],
    publishedAt: '2024-07-01',
    readTime: '7 min read',
    slug: 'my-programming-journey',
    views: 0,
    thumbnail: '/window.svg',
  },
  {
    id: 2,
    title_vi: 'Xây dựng ứng dụng web mở rộng',
    excerpt_vi: 'Phân tích kiến trúc và các thực tiễn tốt nhất khi xây dựng ứng dụng web.',
    title_en: 'Building Scalable Web Applications',
    excerpt_en: 'A deep dive into architecture patterns and best practices for scalable web apps.',
    category: 'Technology',
    tags: ['Web Development', 'Architecture', 'Best Practices'],
    publishedAt: '2024-01-10',
    readTime: '8 min read',
    slug: 'building-scalable-web-applications',
    views: 22,
    thumbnail: '/globe.svg',
  },
  {
    id: 3,
    title_vi: 'Nghệ thuật giải quyết vấn đề trong công nghệ',
    excerpt_vi: 'Cách tôi tiếp cận các vấn đề kỹ thuật phức tạp và các phương pháp hiệu quả.',
    title_en: 'The Art of Problem Solving in Tech',
    excerpt_en: 'How I approach complex technical problems and effective methods.',
    category: 'Knowledge',
    tags: ['Problem Solving', 'Critical Thinking', 'Methodology'],
    publishedAt: '2024-01-05',
    readTime: '6 min read',
    slug: 'art-of-problem-solving-in-tech',
    views: 11,
    thumbnail: '/file.svg',
  },
  {
    id: 4,
    title_vi: 'Hiểu về yêu cầu nghiệp vụ',
    excerpt_vi: 'Hướng dẫn toàn diện về thu thập, phân tích và tài liệu hóa yêu cầu nghiệp vụ.',
    title_en: 'Understanding Business Requirements',
    excerpt_en: 'A comprehensive guide to gathering, analyzing, and documenting business requirements.',
    category: 'Business Analysis',
    tags: ['Requirements', 'Documentation', 'Analysis'],
    publishedAt: '2024-01-01',
    readTime: '7 min read',
    slug: 'understanding-business-requirements',
    views: 20,
    thumbnail: '/next.svg',
  },
]

const cardTextColor = { color: 'oklch(21% .034 264.665)' };
const articleTitleHoverColor = { color: '#2563eb' }; // Tailwind blue-600

export default function Home() {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      
      {/* Cover Section with real image, crop at 80% from top (20% from bottom) and reliable grey overlay */}
      <section className="relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="/covers/cover-home.jpg"
          alt="Homepage Cover"
          fill
          priority
          className="object-cover w-full h-full z-0"
          style={{ objectPosition: 'center 80%' }}
          sizes="100vw"
        />
        {/* Reliable grey overlay for readability */}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(17, 24, 39, 0.7)' }} />
        {/* Content */}
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg text-white">
            Matt Dinh Blog
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed drop-shadow text-white">
            {language === 'vi'
              ? 'Chia sẻ về cuộc sống, công việc và tri thức. Khám phá công nghệ, phát triển sự nghiệp và phát triển bản thân qua các bài viết và trải nghiệm.'
              : 'Sharing insights about life, work, and knowledge. Exploring technology, career growth, and personal development through thoughtful articles and experiences.'}
          </p>
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow"
            >
              {language === 'vi' ? 'Khám phá bài viết' : 'Explore Articles'}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={cardTextColor}>
            {language === 'vi' ? 'Bài viết mới nhất' : 'Latest Articles'}
          </h2>
          <p className="text-lg" style={cardTextColor}>
            {language === 'vi'
              ? 'Khám phá kiến thức, trải nghiệm và chia sẻ từ hành trình của tôi'
              : 'Discover insights, experiences, and knowledge from my journey'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col" style={cardTextColor}>
              {/* Thumbnail - now clickable */}
              <Link href={`/blog/${post.slug}`} className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 block group">
                <Image
                  src={post.thumbnail}
                  alt={language === 'vi' ? post.title_vi : post.title_en}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <span className="sr-only">Go to {language === 'vi' ? post.title_vi : post.title_en}</span>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {post.category}
                  </span>
                  <span className="text-xs" style={cardTextColor}>
                    {post.views} views
                  </span>
                </div>
                
                {/* Title (block link) */}
                <h3 className="text-lg font-bold mb-3 line-clamp-2" style={cardTextColor}>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={cardTextColor}
                    className="block w-full py-1 px-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
                  >
                    <span
                      className="block transition-colors duration-200 group-hover:text-blue-600"
                      style={cardTextColor}
                    >
                      {language === 'vi' ? post.title_vi : post.title_en}
                    </span>
                  </Link>
                </h3>
                
                {/* Excerpt */}
                <p className="mb-4 line-clamp-3 text-sm" style={cardTextColor}>
                  {language === 'vi' ? post.excerpt_vi : post.excerpt_en}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs mb-4" style={cardTextColor}>
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{post.publishedAt}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                {/* Tags - not clickable */}
                <div className="flex items-center space-x-2 mb-4" style={cardTextColor}>
                  <Tag size={12} className="text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs" style={cardTextColor}>
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-xs" style={cardTextColor}>
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Read More Link */}
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center font-medium text-sm transition-colors duration-200 hover:text-blue-600"
                  style={cardTextColor}
                >
                  {language === 'vi' ? 'Đọc tiếp' : 'Read more'}
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Posts Button */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {language === 'vi' ? 'Xem tất cả bài viết' : 'View All Posts'}
          </Link>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  )
}
