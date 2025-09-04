import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AboutClient from './AboutClient'
import { logger } from '@/lib/logger'

export const metadata: Metadata = {
  title: 'About | Matt Dinh',
  description: 'Learn more about Matt Dinh - software engineer, business analyst, and technology enthusiast.',
}

export default async function AboutPage() {
  try {
    logger.dbQuery('Fetching about me data', {
      component: 'AboutPage'
    })
    
    const supabase = await createServerSupabaseClient()
    
    // Fetch about me data with translations
    const { data: aboutMeData, error: aboutMeError } = await supabase
      .from('about_me')
      .select('*')
      .eq('status', 'published')
      .single()

    if (aboutMeError) {
      logger.info('About me table not found, showing fallback content', {
        component: 'AboutPage',
        error: aboutMeError
      })
      return <AboutClient initialData={null} error={aboutMeError.message} />
    }

    // Fetch translations if about me data exists
    if (aboutMeData) {
      const { data: translations, error: translationsError } = await supabase
        .from('about_me_translations')
        .select('*')
        .eq('about_me_id', aboutMeData.id)

      if (translationsError) {
        logger.info('Translations table not found, showing fallback content', {
          component: 'AboutPage',
          error: translationsError
        })
        return <AboutClient initialData={null} error={translationsError.message} />
      }

      const aboutMe = {
        ...aboutMeData,
        translations: translations || []
      }

      logger.info('About me data fetched successfully', {
        component: 'AboutPage',
        data: { translationsCount: translations?.length || 0 }
      })
      return <AboutClient initialData={aboutMe} error={null} />
    }

    logger.info('No about me data found, showing fallback content', {
      component: 'AboutPage'
    })
    return <AboutClient initialData={null} error="No about me data found" />
    
  } catch (error: unknown) {
    logger.error('Error fetching about me data', {
      component: 'AboutPage',
      error: error instanceof Error ? error : new Error(String(error))
    })
    return <AboutClient initialData={null} error={error instanceof Error ? error.message : 'Unknown error'} />
  }
} 