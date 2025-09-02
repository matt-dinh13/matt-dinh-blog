'use client'

import { useLanguage } from '@/components/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
// Using native img to mirror BlogCard and avoid fill-layout constraints

// Unified styling uses theme vars and Tailwind like blog cards
const CARD_TEXT_COLOR = { color: 'var(--foreground)', fontFamily: 'Inter, system-ui, sans-serif' }

export default function PortfolioListClient() {
  const { language } = useLanguage()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Memoize formatDate
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [language])

  // Memoize rendered projects
  const renderedProjects = useMemo(() => {
    return projects.map((project: any) => {
      const translation = project.translations.find((t: any) => t.language_code === language)
      if (!translation) return null
      return (
        <article
          key={project.id}
          className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <Link href={`/portfolio/${project.slug}`} className="block">
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img
                src={project.thumbnail_url || '/cover.jpg'}
                alt={translation.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
          <div className="flex flex-col flex-1 p-4">
            <h2 className="text-lg font-semibold mb-2" style={CARD_TEXT_COLOR}>
              <Link href={`/portfolio/${project.slug}`} className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
                {translation.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
              {translation.description}
            </p>
            <div className="flex-1" />
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{formatDate(project.published_at || project.created_at)}</span>
              </div>
            </div>
          </div>
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs text-gray-600 dark:text-gray-300">+{project.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            )}
            {/* Project Links */}
            <div className="flex items-center space-x-3 px-4 pb-4">
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
        </article>
      )
    })
  }, [projects, language, formatDate])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient()
        const { data: projectsData, error: projectsError } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
        if (projectsError) {
          console.error('Error fetching projects:', projectsError)
          throw projectsError
        }
        if (!projectsData || projectsData.length === 0) {
          setProjects([])
          return
        }
        const projectIds = projectsData.map((p: any) => p.id)
        const { data: translationsData, error: translationsError } = await supabase
          .from('portfolio_project_translations')
          .select('*')
          .in('portfolio_project_id', projectIds)
          .eq('language_code', language)
        if (translationsError) {
          console.error('Error fetching translations:', translationsError)
          throw translationsError
        }
        const projectsWithTranslations = projectsData.map((project: any) => {
          const translation = translationsData?.find((t: any) => t.portfolio_project_id === project.id)
          return {
            ...project,
            translations: translation ? [translation] : []
          }
        }).filter((project: any) => project.translations.length > 0)
        setProjects(projectsWithTranslations)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load portfolio projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [language])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={CARD_TEXT_COLOR}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={CARD_TEXT_COLOR}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4" style={CARD_TEXT_COLOR}>
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={CARD_TEXT_COLOR}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={CARD_TEXT_COLOR}>
          <div className="text-center">
            <p className="text-red-600" style={CARD_TEXT_COLOR}>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={CARD_TEXT_COLOR}>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={CARD_TEXT_COLOR}>
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4" style={CARD_TEXT_COLOR}>
            {language === 'vi' ? 'Portfolio' : 'Portfolio'}
          </h1>
          <p className="text-xl" style={CARD_TEXT_COLOR}>
            {language === 'vi' 
              ? 'Khám phá các dự án và công việc của tôi trong phát triển phần mềm và phân tích kinh doanh.'
              : 'Explore my projects and work in software development and business analysis.'
            }
          </p>
        </header>
        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400" style={CARD_TEXT_COLOR}>
              {language === 'vi' 
                ? 'Chưa có dự án nào được xuất bản.'
                : 'No published projects yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {renderedProjects}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
} 