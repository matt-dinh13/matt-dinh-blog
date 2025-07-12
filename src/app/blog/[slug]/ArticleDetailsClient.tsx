"use client"

import Link from 'next/link';
import BlogPostViewCountClient from './BlogPostViewCountClient';
import BlogCard from '@/components/BlogCard';
import ReadingTime from '@/components/ReadingTime';
import { Calendar } from 'lucide-react';

interface RelatedPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  publishedAt: string;
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

export default function ArticleDetailsClient({
  postId,
  title,
  content,
  publishedAt,
  createdAt,
  viewCount,
  category,
  tags,
  thumbnailUrl,
  languageCode,
  relatedPosts,
}: {
  postId: string,
  title: string,
  content: string,
  publishedAt: string,
  createdAt: string,
  viewCount: number,
  category: { slug: string, name: string } | null,
  tags: { slug: string, name: string }[],
  thumbnailUrl?: string,
  languageCode: string,
  relatedPosts?: RelatedPost[],
}) {
  const locale = languageCode === 'vi' ? 'vi-VN' : 'en-US';
  const formattedDate = new Date(publishedAt || createdAt).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              <ReadingTime content={content} languageCode={languageCode} />
            </div>
            <BlogPostViewCountClient postId={postId} initialViewCount={viewCount || 0} />
          </div>
          {/* Thumbnail Image */}
          {thumbnailUrl && (
            <div className="my-8">
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full rounded-lg object-cover max-h-96 mx-auto"
                style={{ background: '#f3f4f6' }}
              />
            </div>
          )}
        </header>
        {/* Article Content */}
        <div
          className="text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {/* Category & Hashtags Row */}
        <div className="mt-8 flex flex-row items-center justify-between">
          {/* Category label bottom left */}
          <div>
            {category ? (
              <Link
                href={`/blog/category/${category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 mr-2"
              >
                {category.name}
              </Link>
            ) : null}
          </div>
          {/* Hashtags bottom right */}
          <div className="flex flex-wrap gap-2 justify-end">
            {tags.length > 0 && tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-white transition-colors duration-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
        {/* Share to Social Section */}
        <div className="mt-8">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-700 dark:text-blue-300 text-base">
              {languageCode === 'vi' ? 'Chia sẻ' : 'Share'}
            </span>
            <a href="#" title="Facebook" className="hover:text-blue-600"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
            <a href="#" title="X" className="hover:text-blue-600"><svg width="24" height="24" fill="currentColor" viewBox="0 0 1200 1227"><path d="M1199.97 1.724c.03-.96-.7-1.72-1.66-1.72H958.13c-1.01 0-1.36.46-1.7 1.17L600.01 729.13 243.57 1.17C243.23.46 242.88 0 241.88 0H1.69C.73 0 0 .76 0 1.72c0 .56.24 1.13.54 1.54l484.6 707.13-460.7 513.13c-.7.77-.7 1.93 0 2.7.34.38.81.6 1.3.6h241.13c.7 0 1.09-.32 1.44-.74l373.7-415.97 373.7 415.97c.35.42.74.74 1.44.74h241.13c.49 0 .96-.22 1.3-.6.7-.77.7-1.93 0-2.7l-460.7-513.13 484.6-707.13c.3-.41.54-.98.54-1.54Z"/></svg></a>
            <a href="#" title="Threads" className="hover:text-blue-600"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.182A8.182 8.182 0 1 1 12 3.818a8.182 8.182 0 0 1 0 16.364zm2.182-7.273c0-1.2-.982-2.182-2.182-2.182s-2.182.982-2.182 2.182.982 2.182 2.182 2.182 2.182-.982 2.182-2.182zm-2.182-3.273a3.273 3.273 0 1 0 0 6.546 3.273 3.273 0 0 0 0-6.546zm0 5.455a2.182 2.182 0 1 1 0-4.364 2.182 2.182 0 0 1 0 4.364zm5.455-2.182a5.455 5.455 0 1 1-10.91 0 5.455 5.455 0 0 1 10.91 0z"/></svg></a>
            <a href="#" title="LinkedIn" className="hover:text-blue-600"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.327-.025-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667h-3.554V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.369-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z"/></svg></a>
          </div>
        </div>
        {/* Related Posts Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-blue-400">
              {languageCode === 'vi' ? 'Bài viết liên quan' : 'Related Posts'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 6).map((post) => (
                <BlogCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  description={stripHtml((post as any).content || post.summary).slice(0, 256)}
                  thumbnailUrl={post.thumbnailUrl}
                  publishedAt={post.publishedAt}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
} 