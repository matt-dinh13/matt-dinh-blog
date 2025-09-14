import Image from 'next/image'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { logger } from '@/lib/logger'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function LanguagePortfolioPage({ params }: Props) {
  const { lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  
  const supabase = createClient()
  
  // Fetch published portfolio projects with translations
  const { data: projects, error } = await supabase
    .from('portfolio_projects')
    .select(`
      id,
      slug,
      thumbnail_url,
      project_url,
      github_url,
      technologies,
      published_at,
      portfolio_project_translations!inner(
        title,
        description,
        content,
        language_code
      )
    `)
    .eq('status', 'published')
    .eq('portfolio_project_translations.language_code', language)
    .order('published_at', { ascending: false })

  if (error) {
    logger.error('Error fetching portfolio projects for language page', {
      component: 'LanguagePortfolioPage',
      error: error,
      data: { language }
    })
  }

  const projectsData = projects || []

  // Content based on language
  const content = {
    vi: {
      title: 'Portfolio',
      subtitle: 'Khám phá các dự án và sản phẩm tôi đã tạo ra',
      noProjects: 'Chưa có dự án nào.',
      backToHome: 'Quay lại trang chủ'
    },
    en: {
      title: 'Portfolio',
      subtitle: 'Explore the projects and products I have created',
      noProjects: 'No projects yet.',
      backToHome: 'Back to Home'
    }
  }

  const text = content[language]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {text.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {text.subtitle}
          </p>
        </div>

        {projectsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{text.noProjects}</p>
            <Link 
              href={`/${language}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {text.backToHome}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project: any) => {
              const translation = project.portfolio_project_translations[0]
              return (
                <Link
                  key={project.id}
                  href={`/${language}/portfolio/${project.slug}`}
                  className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={project.thumbnail_url || "/covers/cover-home.jpg"}
                      alt={translation.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      width={400}
                      height={225}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {translation.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {translation.description}
                    </p>
                    {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech: string) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const language = lang === 'en' ? 'en' : 'vi'
  
  return {
    title: language === 'vi' ? 'Portfolio | Matt Dinh' : 'Portfolio | Matt Dinh',
    description: language === 'vi' 
      ? 'Khám phá các dự án và sản phẩm tôi đã tạo ra' 
      : 'Explore the projects and products I have created'
  }
} 