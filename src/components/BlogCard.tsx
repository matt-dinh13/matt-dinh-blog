import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { CARD_TITLE_COLOR, CARD_DESC_COLOR } from './constants'

interface BlogCardProps {
  slug: string
  title: string
  description: string
  thumbnailUrl?: string
  publishedAt: string
  locale?: string
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

export default function BlogCard({ slug, title, description, thumbnailUrl, publishedAt, locale = 'en-US' }: BlogCardProps) {
  const shortDesc = stripHtml(description).slice(0, 256);
  return (
    <article className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link href={`/blog/${slug}`} className="block">
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={thumbnailUrl || '/cover.jpg'}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      </Link>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-lg font-semibold mb-2" style={{ color: CARD_TITLE_COLOR }}>
          <Link href={`/blog/${slug}`} className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
            {title}
          </Link>
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3" style={{ color: CARD_DESC_COLOR }}>
          {shortDesc}
        </p>
        <div className="flex-1" />
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2">
          <Calendar size={12} className="mr-1" />
          <span>{new Date(publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </article>
  )
} 