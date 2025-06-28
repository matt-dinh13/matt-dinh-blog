import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Matt Dinh',
  description: 'Read my latest articles about software development, business analysis, and career insights.',
}

const mockPosts = [
  {
    id: 1,
    title: "My Journey in Software Development",
    excerpt: "Reflecting on my path from beginner to professional developer, the challenges I faced, and the lessons learned along the way.",
    category: "Career",
    tags: ["Software Development", "Career Growth", "Learning"],
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    slug: "my-journey-in-software-development",
    views: 47,
    thumbnail: '/window.svg',
  },
  {
    id: 2,
    title: "Building Scalable Web Applications",
    excerpt: "A deep dive into the architecture patterns and best practices I've learned while building production-ready web applications.",
    category: "Technology",
    tags: ["Web Development", "Architecture", "Best Practices"],
    publishedAt: "2024-01-10",
    readTime: "8 min read",
    slug: "building-scalable-web-applications",
    views: 22,
    thumbnail: '/globe.svg',
  },
  {
    id: 3,
    title: "The Art of Problem Solving in Tech",
    excerpt: "How I approach complex technical problems and the systematic methods that help me find effective solutions.",
    category: "Knowledge",
    tags: ["Problem Solving", "Critical Thinking", "Methodology"],
    publishedAt: "2024-01-05",
    readTime: "6 min read",
    slug: "art-of-problem-solving-in-tech",
    views: 11,
    thumbnail: '/file.svg',
  },
  {
    id: 4,
    title: "Understanding Business Requirements",
    excerpt: "A comprehensive guide to gathering, analyzing, and documenting business requirements effectively.",
    category: "Business Analysis",
    tags: ["Requirements", "Documentation", "Analysis"],
    publishedAt: "2024-01-01",
    readTime: "7 min read",
    slug: "understanding-business-requirements",
    views: 20,
    thumbnail: '/next.svg',
  }
]

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        <h1 className="text-3xl font-bold mb-10 text-center text-white">Blog</h1>
        <div className="flex flex-col gap-8">
          {mockPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row" style={cardTextColor}>
              {/* Thumbnail - clickable */}
              <Link href={`/blog/${post.slug}`} className="relative w-full md:w-48 h-40 bg-gray-100 dark:bg-gray-700 block group flex-shrink-0">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, 192px"
                  priority
                />
                <span className="sr-only">Go to {post.title}</span>
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
                <h2 className="text-lg font-bold mb-2 line-clamp-2" style={cardTextColor}>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={cardTextColor}
                    className="block w-full py-1 px-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
                  >
                    <span
                      className="block transition-colors duration-200 group-hover:text-blue-600"
                      style={cardTextColor}
                    >
                      {post.title}
                    </span>
                  </Link>
                </h2>
                {/* Excerpt */}
                <p className="mb-3 line-clamp-3 text-sm" style={cardTextColor}>
                  {post.excerpt}
                </p>
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs mb-3" style={cardTextColor}>
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
                  Read more
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  )
} 