import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

type Props = {
  params: Promise<{ slug: string }>
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  
  // Fetch project data from Supabase
  const supabase = await createServerSupabaseClient()
  const { data: project, error: projectError } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (projectError || !project) {
    console.error('Error fetching project:', projectError)
    return notFound()
  }

  // Fetch translations for the project
  const { data: translations, error: translationsError } = await supabase
    .from('portfolio_project_translations')
    .select('*')
    .eq('portfolio_project_id', project.id)

  if (translationsError) {
    console.error('Error fetching translations:', translationsError)
    return notFound()
  }

  // Get English translation as default, fallback to first available
  const translation = translations?.find((t: any) => t.language_code === 'en') || translations?.[0]
  
  if (!translation) {
    console.error('No translation found for project')
    return notFound()
  }

  return (
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
          {(project.project_url || project.github_url) && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3" style={cardTextColor}>Project Links</h3>
              <div className="flex flex-wrap gap-3">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <span>Live Demo</span>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3" style={cardTextColor}>Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, index: number) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700"
                    style={cardTextColor}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  )
} 