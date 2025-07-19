import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About | Matt Dinh',
  description: 'Learn more about Matt Dinh - software engineer, business analyst, and technology enthusiast.',
}

export default async function AboutPage() {
  try {
    console.log('🔍 Server: Fetching about me data...')
    
    const supabase = await createServerSupabaseClient()
    
    // Fetch about me data with translations
    const { data: aboutMeData, error: aboutMeError } = await supabase
      .from('about_me')
      .select('*')
      .eq('status', 'published')
      .single()

    if (aboutMeError) {
      console.log('🔍 Server: About me table not found, will show fallback content')
      return <AboutClient initialData={null} error={aboutMeError.message} />
    }

    if (aboutMeData) {
      // Fetch translations
      const { data: translations, error: translationsError } = await supabase
        .from('about_me_translations')
        .select('*')
        .eq('about_me_id', aboutMeData.id)

      if (translationsError) {
        console.log('🔍 Server: Translations table not found, will show fallback content')
        return <AboutClient initialData={null} error={translationsError.message} />
      }

      const aboutMe = {
        ...aboutMeData,
        translations: translations || []
      }

      console.log('✅ Server: About me data fetched successfully')
      return <AboutClient initialData={aboutMe} error={null} />
    }

    console.log('🔍 Server: No about me data found, will show fallback content')
    return <AboutClient initialData={null} error="No about me data found" />
    
  } catch (error: any) {
    console.error('💥 Server: Error fetching about me:', error)
    return <AboutClient initialData={null} error={error.message} />
  }
} 