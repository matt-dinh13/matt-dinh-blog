import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryArticleListClient from './CategoryArticleListClient'

const cardTextColor = { color: 'var(--foreground)' };

type Props = {
  params: Promise<{ lang: string; slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { lang, slug } = await params
  const language = lang === 'en' ? 'en' : 'vi'
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
          <Link href={`/${language}/blog`} className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
            <ArrowLeft size={16} />
            <span>{language === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}</span>
          </Link>
          <div className="text-center text-red-600 dark:text-red-400 font-semibold">{language === 'vi' ? 'Không tìm thấy chuyên mục.' : 'Category not found.'}</div>
        </main>
        <Footer />
      </div>
    )
  }

  // Get category name in current language
  const categoryName = category.category_translations?.find((t: any) => t.language_code === language)?.name || category.category_translations?.[0]?.name || slug

  // Breadcrumbs localized
  const breadcrumbs = [
    { label: language === 'vi' ? 'Trang chủ' : 'Home', href: `/${language}` },
    { label: language === 'vi' ? 'Blog' : 'Blog', href: `/${language}/blog` },
    { label: language === 'vi' ? 'Chuyên mục' : 'Category' },
    { label: categoryName }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col" style={cardTextColor}>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1" style={cardTextColor}>
        <Breadcrumbs items={breadcrumbs} />
        <Link href={`/${language}/blog`} className="inline-flex items-center space-x-2 mb-8 transition-colors duration-200 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">
          <ArrowLeft size={16} />
          <span>{language === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}</span>
        </Link>
        <h1 className="text-3xl font-bold mb-8" style={cardTextColor}>{categoryName}</h1>
        <CategoryArticleListClient categoryId={category.id} language={language} />
      </main>
      <Footer />
    </div>
  )
} 