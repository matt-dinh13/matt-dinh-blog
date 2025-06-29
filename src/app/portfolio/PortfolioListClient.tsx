'use client'

import { useLanguage } from '@/components/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, ExternalLink, Github, Tag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

export default function PortfolioListClient() {
  const { language } = useLanguage()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select(`
            id,
            slug,
            status,
            project_url,
            github_url,
            technologies,
            published_at,
            created_at,
            translations!inner(
              language_code,
              title,
              description
            )
          `)
          .eq('status', 'published')
          .eq('translations.language_code', language)
          .order('published_at', { ascending: false })

        if (error) throw error

        setProjects(data || [])
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load portfolio projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [language])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4" style={cardTextColor}>
              {language === 'vi' ? 'Đang tải dự án...' : 'Loading projects...'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
          <div className="text-center">
            <p className="text-red-600" style={cardTextColor}>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4" style={cardTextColor}>
            {language === 'vi' ? 'Portfolio' : 'Portfolio'}
          </h1>
          <p className="text-xl" style={cardTextColor}>
            {language === 'vi' 
              ? 'Khám phá các dự án và công việc của tôi trong phát triển phần mềm và phân tích kinh doanh.'
              : 'Explore my projects and work in software development and business analysis.'
            }
          </p>
        </header>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400" style={cardTextColor}>
              {language === 'vi' 
                ? 'Chưa có dự án nào được xuất bản.'
                : 'No published projects yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => {
              const translation = project.translations.find((t: any) => t.language_code === language)

              if (!translation) return null

              return (
                <article 
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  style={cardTextColor}
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                    <img
                      src="/covers/cover-home.jpg"
                      alt={translation.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>

                  <div className="p-6">
                    {/* Project Header */}
                    <header className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {language === 'vi' ? 'Dự án' : 'Project'}
                        </span>
                        <div className="flex items-center space-x-1 text-sm" style={cardTextColor}>
                          <Calendar size={14} />
                          <span>{formatDate(project.published_at || project.created_at)}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-3" style={cardTextColor}>
                        <Link 
                          href={`/portfolio/${project.slug}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          {translation.title}
                        </Link>
                      </h2>
                      
                      <p className="text-sm mb-4" style={cardTextColor}>
                        {translation.description}
                      </p>
                    </header>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2" style={cardTextColor}>
                          {language === 'vi' ? 'Công nghệ:' : 'Technologies:'}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech: any, index: number) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700"
                              style={cardTextColor}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs" style={cardTextColor}>
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex items-center space-x-3">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <ExternalLink size={14} />
                          <span className="text-sm">{language === 'vi' ? 'Xem demo' : 'Live demo'}</span>
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                          <Github size={14} />
                          <span className="text-sm">GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
} 