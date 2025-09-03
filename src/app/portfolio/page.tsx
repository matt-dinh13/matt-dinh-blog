import { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PortfolioClientWrapper from './PortfolioClientWrapper'

export const metadata: Metadata = {
  title: 'Portfolio | Matt Dinh',
  description: 'Explore my projects and work in software development and business analysis.',
}

export default async function PortfolioListPage() {
  // Fetch portfolio projects for all languages
  const supabase = createClient()
  
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
      portfolio_project_translations(
        language_code,
        title,
        description,
        content
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching portfolio projects:', error)
  }

  const projectsData = projects || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <PortfolioClientWrapper projects={projectsData} />
      <Footer />
    </div>
  )
} 