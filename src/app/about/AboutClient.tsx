'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { Mail, Linkedin, Github } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

interface AboutMeData {
  id: number
  status: 'draft' | 'published'
  published_at: string | null
  translations: {
    id: number
    language_code: string
    title: string
    subtitle: string
    content: string
    meta_title: string
    meta_description: string
  }[]
}

export default function AboutClient() {
  const { language } = useLanguage()
  const [aboutMe, setAboutMe] = useState<AboutMeData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchAboutMe = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch published about me data
      const { data: aboutMeData, error: aboutMeError } = await supabase
        .from('about_me')
        .select('*')
        .eq('status', 'published')
        .single()

      if (aboutMeError) {
        console.error('Error fetching about me:', aboutMeError)
        return
      }

      if (aboutMeData) {
        // Fetch translations
        const { data: translations, error: translationsError } = await supabase
          .from('about_me_translations')
          .select('*')
          .eq('about_me_id', aboutMeData.id)

        if (translationsError) {
          console.error('Error fetching translations:', translationsError)
          return
        }

        setAboutMe({
          ...aboutMeData,
          translations: translations || []
        })
      }
    } catch (error) {
      console.error('Error fetching about me:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchAboutMe()
  }, [fetchAboutMe])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!aboutMe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">About me page not found.</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const translation = aboutMe.translations.find(t => t.language_code === language)
  
  if (!translation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Translation not available for this language.</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={cardTextColor}>
            {translation.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {translation.subtitle}
          </p>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Image
              src="/logo-square.jpg"
              alt="Matt Dinh"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Content */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-6" style={cardTextColor}>
              {language === 'en' ? 'Get In Touch' : 'Liên Hệ'}
            </h2>
            <p className="text-lg mb-6" style={cardTextColor}>
              {language === 'en' 
                ? "I'm always interested in new opportunities and collaborations. Feel free to reach out!"
                : "Tôi luôn quan tâm đến những cơ hội mới và sự hợp tác. Hãy liên hệ với tôi!"
              }
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="mailto:matt@example.com"
                className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <Mail size={20} />
                <span>Email</span>
              </a>
              <a
                href="https://linkedin.com/in/mattdinh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/mattdinh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 