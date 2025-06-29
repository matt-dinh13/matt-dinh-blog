import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryArticleListClient from './CategoryArticleListClient'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = createClient()

  // Get category info
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, category_translations(name)')
    .eq('slug', slug)
    .single()

  if (categoryError || !category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
          <Link href="/blog" className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>
          <div className="text-center text-red-600 dark:text-red-400 font-semibold">Category not found.</div>
        </main>
        <Footer />
      </div>
    )
  }

  // Get category name (English for now)
  const categoryName = category.category_translations?.[0]?.name || slug

  // Use constant language for now
  const language = 'en'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Category' },
          { label: categoryName }
        ]} />
        <Link href="/blog" className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
          <ArrowLeft size={16} />
          <span>Back to Blog</span>
        </Link>
        <h1 className="text-3xl font-bold mb-8 text-white">{categoryName}</h1>
        <CategoryArticleListClient categoryId={category.id} categorySlug={slug} categoryName={categoryName} language={language} />
      </main>
      <Footer />
    </div>
  )
} 