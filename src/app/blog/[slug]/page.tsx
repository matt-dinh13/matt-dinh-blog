import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, Clock, Tag, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

// Mock data - will be replaced with Supabase data
const mockPosts = {
  'my-journey-in-software-development': {
    id: 1,
    title: "My Journey in Software Development",
    content: `
      <h2>The Beginning</h2>
      <p>My journey in software development began with a simple curiosity about how websites work. I remember the first time I opened the browser's developer tools and saw the HTML structure - it was like discovering a new language.</p>
      
      <h2>The Learning Phase</h2>
      <p>I started with HTML and CSS, then moved to JavaScript. The transition from static pages to interactive applications was both challenging and exciting. Every bug I fixed felt like a small victory.</p>
      
      <h2>Professional Growth</h2>
      <p>As I progressed in my career, I learned that software development is not just about writing code. It's about solving problems, working in teams, and continuously learning new technologies.</p>
      
      <h2>Key Lessons Learned</h2>
      <ul>
        <li>Always write clean, readable code</li>
        <li>Test your code thoroughly</li>
        <li>Stay updated with industry trends</li>
        <li>Collaborate effectively with team members</li>
      </ul>
      
      <h2>Looking Forward</h2>
      <p>The technology landscape is constantly evolving, and I'm excited to continue learning and growing as a developer. There's always something new to discover.</p>
    `,
    category: "Career",
    tags: ["Software Development", "Career Growth", "Learning"],
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    excerpt: "Reflecting on my path from beginner to professional developer, the challenges I faced, and the lessons learned along the way.",
    views: 47
  }
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = mockPosts[params.slug as keyof typeof mockPosts]

  if (!post) {
    notFound()
  }

  // Add custom style for headings in the article content
  const proseStyle = `
    h1, h2, h3, h4, h5, h6 {
      color: oklch(21% .034 264.665) !important;
      font-family: Inter, system-ui, sans-serif !important;
      font-weight: 500 !important;
    }
    p, ul, ol, li {
      font-family: Inter, system-ui, sans-serif !important;
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200"
          style={cardTextColor}
        >
          <ArrowLeft size={16} />
          <span>Back to Blog</span>
        </Link>

        {/* Article Card */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" style={cardTextColor}>
          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {post.category}
                </span>
                <div className="flex items-center space-x-1 text-sm" style={cardTextColor}>
                  <Eye size={14} />
                  <span>{post.views} views</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4" style={cardTextColor}>
                {post.title}
              </h1>
              
              <p className="text-lg mb-6" style={cardTextColor}>
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm" style={cardTextColor}>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{post.publishedAt}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Tag size={14} className="text-gray-400" />
                  <div className="flex space-x-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-sm" style={cardTextColor}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <style>{proseStyle}</style>
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              style={cardTextColor}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
} 