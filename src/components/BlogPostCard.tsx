import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import { CARD_TITLE_COLOR, CARD_DESC_COLOR } from './constants'
import { getBestSummary } from '@/lib/summary-generator'

interface BlogPost {
  id: number
  slug: string
  thumbnail_url: string | null
  published_at: string | null
  created_at: string
}

interface Translation {
  language_code: string
  title: string
  summary: string
  content: string
}

interface BlogPostCardProps {
  post: BlogPost
  translation: Translation
  thumbnailUrl: string
  formatDate: (dateString: string) => string
  language: string
}

// Utility function to strip HTML and create description
function createDescription(content: string): string {
  return getBestSummary(content, 260)
}

export function BlogPostCard({ 
  post, 
  translation, 
  thumbnailUrl, 
  formatDate, 
  language 
}: BlogPostCardProps) {
  const isPlaceholder = !post.thumbnail_url
        const description = createDescription(translation.content)

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Thumbnail - clickable */}
      <Link href={`/blog/${post.slug}`} className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 block group overflow-hidden">
        {isPlaceholder ? (
          // Placeholder thumbnail
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
            <Image
              src={thumbnailUrl}
              alt={translation.title}
              width={64}
              height={64}
              className="object-contain opacity-60 group-hover:scale-110 transition-transform duration-200"
            />
          </div>
        ) : (
          // Real thumbnail from database
          <Image
            src={thumbnailUrl}
            alt={translation.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        )}
        <span className="sr-only">Go to {translation.title}</span>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        {/* Title (block link) */}
        <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[3em]" style={{ color: CARD_TITLE_COLOR }}>
          <Link
            href={`/blog/${post.slug}`}
            className="block w-full py-1 px-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
          >
            <span className="block transition-colors duration-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">
              {translation.title}
            </span>
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="mb-4 line-clamp-3 min-h-[4.5em] text-sm" style={{ color: CARD_DESC_COLOR }}>
          {description}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            <span>{language === 'vi' ? 'Đọc thêm' : 'Read more'}</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  )
} 