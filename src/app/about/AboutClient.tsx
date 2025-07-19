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

interface AboutClientProps {
  initialData?: AboutMeData | null
  error?: string | null
}

export default function AboutClient({ initialData = null, error: initialError = null }: AboutClientProps) {
  const { language } = useLanguage()
  const [aboutMe, setAboutMe] = useState<AboutMeData | null>(initialData)
  const [loading, setLoading] = useState(initialData === null && !initialError)
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
        // If table doesn't exist, we'll show fallback content
        setLoading(false)
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
          // If translations table doesn't exist, we'll show fallback content
          setLoading(false)
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
    // Only fetch data if we don't have initial data and no error
    if (initialData === null && !initialError) {
      fetchAboutMe()
    }
  }, [fetchAboutMe, initialData, initialError])

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
    // Show fallback content when tables don't exist
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={cardTextColor}>
              {language === 'en' ? 'About Me' : 'Về Tôi'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {language === 'en' ? 'Software Engineer & Business Analyst' : 'Kỹ Sư Phần Mềm & Phân Tích Viên Kinh Doanh'}
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
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {language === 'en' ? (
                  <>
                    <h2>About Me</h2>
                    <p>Hello! I&apos;m Matt Dinh, a passionate software engineer and business analyst with a love for creating meaningful solutions that bridge technology and business needs.</p>
                    <p>With over 5 years of experience in software development and business analysis, I specialize in building scalable web applications, analyzing business requirements, and translating complex problems into elegant technical solutions.</p>
                    
                    <h3>Skills & Expertise</h3>
                    <h4>Technical Skills</h4>
                    <ul>
                      <li>JavaScript/TypeScript</li>
                      <li>React/Next.js</li>
                      <li>Node.js/Python</li>
                      <li>PostgreSQL/MongoDB</li>
                      <li>Docker/AWS</li>
                    </ul>
                    
                    <h4>Business Analysis</h4>
                    <ul>
                      <li>Requirements Gathering</li>
                      <li>Process Modeling</li>
                      <li>Stakeholder Management</li>
                      <li>Data Analysis</li>
                      <li>Project Management</li>
                    </ul>
                    
                    <h4>Soft Skills</h4>
                    <ul>
                      <li>Problem Solving</li>
                      <li>Communication</li>
                      <li>Team Leadership</li>
                      <li>Critical Thinking</li>
                      <li>Adaptability</li>
                    </ul>
                    
                    <h3>Professional Experience</h3>
                    <h4>Senior Software Engineer</h4>
                    <p><strong>Tech Solutions Inc.</strong> | 2022 - Present</p>
                    <p>Leading development of enterprise web applications, mentoring junior developers, and collaborating with cross-functional teams.</p>
                    
                    <h3>Education</h3>
                    <h4>Bachelor of Computer Science</h4>
                    <p><strong>University of Technology</strong> | 2019</p>
                  </>
                ) : (
                  <>
                    <h2>Về Tôi</h2>
                    <p>Xin chào! Tôi là Matt Dinh, một kỹ sư phần mềm và phân tích viên kinh doanh đam mê, với tình yêu tạo ra những giải pháp có ý nghĩa kết nối công nghệ và nhu cầu kinh doanh.</p>
                    <p>Với hơn 5 năm kinh nghiệm trong phát triển phần mềm và phân tích kinh doanh, tôi chuyên về xây dựng các ứng dụng web có khả năng mở rộng, phân tích yêu cầu kinh doanh và chuyển đổi các vấn đề phức tạp thành các giải pháp kỹ thuật thanh lịch.</p>
                    
                    <h3>Kỹ Năng & Chuyên Môn</h3>
                    <h4>Kỹ Năng Kỹ Thuật</h4>
                    <ul>
                      <li>JavaScript/TypeScript</li>
                      <li>React/Next.js</li>
                      <li>Node.js/Python</li>
                      <li>PostgreSQL/MongoDB</li>
                      <li>Docker/AWS</li>
                    </ul>
                    
                    <h4>Phân Tích Kinh Doanh</h4>
                    <ul>
                      <li>Thu thập Yêu cầu</li>
                      <li>Mô hình hóa Quy trình</li>
                      <li>Quản lý Các bên liên quan</li>
                      <li>Phân tích Dữ liệu</li>
                      <li>Quản lý Dự án</li>
                    </ul>
                    
                    <h4>Kỹ Năng Mềm</h4>
                    <ul>
                      <li>Giải quyết Vấn đề</li>
                      <li>Giao tiếp</li>
                      <li>Lãnh đạo Nhóm</li>
                      <li>Tư duy Phản biện</li>
                      <li>Thích ứng</li>
                    </ul>
                    
                    <h3>Kinh Nghiệm Chuyên Môn</h3>
                    <h4>Kỹ Sư Phần Mềm Cao Cấp</h4>
                    <p><strong>Tech Solutions Inc.</strong> | 2022 - Hiện Tại</p>
                    <p>Lãnh đạo phát triển các ứng dụng web doanh nghiệp, hướng dẫn các lập trình viên trẻ và hợp tác với các nhóm đa chức năng.</p>
                    
                    <h3>Học Vấn</h3>
                    <h4>Cử Nhân Khoa Học Máy Tính</h4>
                    <p><strong>Đại Học Công Nghệ</strong> | 2019</p>
                  </>
                )}
              </div>
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