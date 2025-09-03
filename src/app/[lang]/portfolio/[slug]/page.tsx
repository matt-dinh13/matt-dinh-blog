import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Metadata } from 'next'

const cardTextColor = { color: 'var(--foreground)' };

type Props = {
  params: Promise<{ slug: string, lang: string }>
}

export default async function LanguagePortfolioDetailPage({ params }: Props) {
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

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
          <Link href={`/${language}/portfolio`} className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">← {language === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}</Link>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-6 text-gray-900 dark:text-gray-100">
            <div className="flex flex-col items-center mb-6">
              <Image
                src={project.thumbnail_url || "/covers/cover-home.jpg"}
                alt={translation.title}
                width={120}
                height={120}
                className="object-contain mb-4"
                priority
              />
              <h1 className="text-2xl font-bold mb-2 text-center">{translation.title}</h1>
              <p className="text-base mb-2 text-center text-gray-700 dark:text-gray-300">{translation.description}</p>
            </div>
            {Array.isArray(project.technologies) && project.technologies.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div
              className="prose dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: translation.content || '' }}
            />
            <div className="flex gap-4 justify-center">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {language === 'vi' ? 'Xem Demo' : 'View Demo'}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  {language === 'vi' ? 'Mã nguồn' : 'Source Code'}
                </a>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  
  const supabase = await createServerSupabaseClient()
  const { data: project } = await supabase
    .from('portfolio_projects')
    .select(`
      *,
      portfolio_project_translations(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!project) {
    return {
      title: 'Project Not Found | Matt Dinh',
      description: 'The requested project could not be found.'
    }
  }

  const translation = project.portfolio_project_translations?.find((t: any) => t.language_code === language)
  
  if (!translation) {
    return {
      title: 'Project Not Available | Matt Dinh',
      description: language === 'vi' 
        ? 'Dự án này chưa có bản dịch tiếng Việt.' 
        : 'This project is not available in English.'
    }
  }

  function stripHtml(html: string) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }

  return {
    title: `${translation.title} | Matt Dinh Portfolio`,
    description: stripHtml(translation.content).slice(0, 160),
    openGraph: {
      title: translation.title,
      description: translation.description || stripHtml(translation.content).slice(0, 160),
      images: project.thumbnail_url ? [{ url: project.thumbnail_url }] : undefined,
    }
  }
} 