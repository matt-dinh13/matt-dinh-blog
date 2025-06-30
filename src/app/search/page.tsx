"use client"

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowRight } from "lucide-react";
import { useLanguage } from '@/components/LanguageProvider';

const PAGE_SIZE = 6;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const { language } = useLanguage();

  const fetchResults = useCallback(async (reset = false) => {
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const from = (reset ? 0 : (page - 1) * PAGE_SIZE);
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await supabase
      .from("blog_post_translations")
      .select(
        `blog_post_id, title, summary, blog_posts!inner(id, slug, status, published_at, thumbnail_url)`,
        { count: "exact" }
      )
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .eq("blog_posts.status", "published")
      .range(from, to);
    if (error) {
      setResults([]);
      setHasMore(false);
      setLoading(false);
      return;
    }
    setResults(reset ? data : [...results, ...data]);
    setHasMore((count || 0) > to + 1);
    setLoading(false);
  }, [query, page, results]);

  useEffect(() => {
    setPage(1);
    fetchResults(true);
  }, [query, fetchResults]);

  useEffect(() => {
    if (page === 1) return;
    fetchResults();
  }, [page, fetchResults]);

  // Breadcrumbs
  const breadcrumbItems = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: query, href: `/search?q=${encodeURIComponent(query)}` }
  ], [query]);

  // Localized content
  const localized = useMemo(() => ({
    search: language === 'vi' ? 'Tìm kiếm' : 'Search',
    resultsFor: language === 'vi' ? 'Kết quả cho' : 'Search results for',
    enterKeyword: language === 'vi' ? 'Nhập từ khóa để tìm bài viết.' : 'Enter a keyword to search articles.',
    noArticles: language === 'vi' ? 'Không tìm thấy bài viết nào.' : 'No articles found.',
    loading: language === 'vi' ? 'Đang tải...' : 'Loading...',
    readMore: language === 'vi' ? 'Đọc thêm' : 'Read more',
    dateLocale: language === 'vi' ? 'vi-VN' : 'en-US',
  }), [language]);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString(localized.dateLocale, {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }, [localized.dateLocale])

  // Get thumbnail
  const getThumbnailUrl = useCallback((post: any) => {
    return post.blog_posts?.thumbnail_url || '/window.svg'
  }, [])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mb-8 text-left">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {query ? `${localized.search}: "${query}"` : localized.search}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {query ? `${localized.resultsFor} "${query}"` : localized.enterKeyword}
            </p>
          </div>

          {loading && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">{localized.loading}</div>
          )}
          {!loading && results.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">{localized.noArticles}</div>
          )}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => {
              const categoryName = result.blog_posts?.categories?.category_translations?.[0]?.name;
              return (
                <article key={result.blog_post_id + '-' + result.title + '-' + index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                  <Link href={`/blog/${result.blog_posts.slug}`} className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 block group overflow-hidden">
                    <Image
                      src={getThumbnailUrl(result)}
                      alt={result.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="sr-only">Go to {result.title}</span>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    {categoryName && (
                      <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {categoryName}
                      </span>
                    )}
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[3em]">
                      <Link
                        href={`/blog/${result.blog_posts.slug}`}
                        className="block w-full rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
                      >
                        <span
                          className="block transition-colors duration-200 group-hover:text-blue-600"
                          style={{ color: 'var(--color-gray-900)', filter: 'unset' }}
                        >
                          {result.title}
                        </span>
                      </Link>
                    </h3>
                    <p className="mb-4 line-clamp-3 min-h-[4.5em] text-sm text-gray-600 dark:text-gray-400">
                      {result.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                      <span>{formatDate(result.blog_posts.published_at)}</span>
                      <Link href={`/blog/${result.blog_posts.slug}`} className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium">
                        <span>{localized.readMore}</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setPage(page + 1)}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 