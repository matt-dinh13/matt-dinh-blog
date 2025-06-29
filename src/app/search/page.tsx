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

const PAGE_SIZE = 6;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

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
  }, [query, page]);

  useEffect(() => {
    setPage(1);
    fetchResults(true);
    // eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    if (page === 1) return;
    fetchResults();
    // eslint-disable-next-line
  }, [page]);

  // Breadcrumbs
  const breadcrumbItems = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: query, href: `/search?q=${encodeURIComponent(query)}` }
  ], [query]);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }, [])

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
              {query ? `Search: "${query}"` : 'Search'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {query ? `Search results for "${query}"` : 'Enter a keyword to search articles.'}
            </p>
          </div>

          {loading && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</div>
          )}
          {!loading && results.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">No articles found.</div>
          )}
          <div className="space-y-6">
            {results.map((result, index) => (
              <article key={result.blog_post_id + '-' + result.title + '-' + index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail Section */}
                  <div className="md:w-1/4">
                    <Link href={`/blog/${result.blog_posts.slug}`} className="block relative h-48 md:h-full bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                      <Image
                        src={getThumbnailUrl(result)}
                        alt={result.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </Link>
                  </div>
                  {/* Content Section */}
                  <div className="md:w-3/4 p-6">
                    <header className="mb-4">
                      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                        <Link href={`/blog/${result.blog_posts.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                          <span className="block transition-colors duration-200 group-hover:text-blue-600">
                            {result.title}
                          </span>
                        </Link>
                      </h2>
                      <p className="text-lg mb-4 text-gray-600 dark:text-gray-400">
                        {result.summary}
                      </p>
                    </header>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>{formatDate(result.blog_posts.published_at)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href={`/blog/${result.blog_posts.slug}`} className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        <span>Read more</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
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
        </div>
      </main>
      <Footer />
    </>
  );
} 