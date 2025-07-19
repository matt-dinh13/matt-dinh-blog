import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Head from 'next/head'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

type Props = {
  params: Promise<{ slug: string, lang: string }>
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug, lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  // Fetch project data from Supabase
  const supabase = await createServerSupabaseClient()
  const { data: project, error: projectError } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (projectError || !project) {
    return notFound()
  }

  // Fetch translations for the project
  const { data: translations, error: translationsError } = await supabase
    .from('portfolio_project_translations')
    .select('*')
    .eq('portfolio_project_id', project.id)

  if (translationsError) {
    return notFound()
  }

  // Find translation for current language
  const translation = translations?.find((t: any) => t.language_code === language)

  if (!translation) {
    // Show not available message
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
          <Link href={`/${language}/portfolio`} className="text-blue-600 hover:underline mb-6 inline-block">← {language === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}</Link>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-6 text-center" style={cardTextColor}>
            <div className="text-red-600 dark:text-red-400 font-semibold my-12">
              {language === 'vi'
                ? 'Dự án này chưa có bản dịch tiếng Việt.'
                : 'This project is not available in English.'}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Generate meta description
  function stripHtml(html: string) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }
  const metaTitle = translation.title || 'Matt Dinh Portfolio'
  const metaDescription = stripHtml(translation.content).slice(0, 160)

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
          <Link href="/portfolio" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Portfolio</Link>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-6" style={cardTextColor}>
            <div className="flex flex-col items-center mb-6">
              <Image
                src={project.thumbnail_url || "/covers/cover-home.jpg"}
                alt={translation.title}
                width={120}
                height={120}
                className="object-contain mb-4"
                priority
              />
              <h1 className="text-2xl font-bold mb-2 text-center" style={cardTextColor}>{translation.title}</h1>
              <p className="text-base mb-2 text-center" style={cardTextColor}>{translation.description}</p>
            </div>
            <div className="prose prose-blue max-w-none" style={cardTextColor}>
              <div dangerouslySetInnerHTML={{ __html: translation.content }} />
            </div>
            {/* Project Links */}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
} 