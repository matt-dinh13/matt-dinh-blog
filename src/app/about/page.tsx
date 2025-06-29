'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useLanguage } from '@/components/LanguageProvider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Matt Dinh',
  description: 'Learn more about Matt Dinh - software engineer, business analyst, and technology enthusiast.',
}

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default function AboutPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center" style={cardTextColor}>
            {language === 'vi' ? 'Về Tôi' : 'About Me'}
          </h1>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>
              {language === 'vi' ? '👋 Xin chào, tôi là Matt Dinh' : '👋 Hi, I&apos;m Matt Dinh'}
            </h2>
            <p className="mb-4 text-base" style={cardTextColor}>
              {language === 'vi' 
                ? 'Tôi là một kỹ sư phần mềm và nhà phân tích nghiệp vụ đam mê với hơn 5 năm kinh nghiệm trong việc xây dựng các ứng dụng web và di động hiện đại. Tôi thích chia sẻ kiến thức, viết về hành trình của mình và giúp đỡ người khác phát triển sự nghiệp.'
                : 'I&apos;m a passionate software engineer and business analyst with over 5 years of experience in building modern web and mobile applications. I love sharing knowledge, writing about my journey, and helping others grow in their careers.'
              }
            </p>
            <p className="mb-4 text-base" style={cardTextColor}>
              {language === 'vi'
                ? 'Khi không lập trình hoặc phân tích yêu cầu nghiệp vụ, bạn có thể tìm thấy tôi khám phá các công nghệ mới, đóng góp cho các dự án mã nguồn mở hoặc hướng dẫn các lập trình viên trẻ. Tôi tin vào việc học tập liên tục và cập nhật các xu hướng mới nhất trong ngành.'
                : 'When I&apos;m not coding or analyzing business requirements, you can find me exploring new technologies, contributing to open-source projects, or mentoring junior developers. I believe in continuous learning and staying up-to-date with the latest industry trends.'
              }
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>
              {language === 'vi' ? '💼 Hành trình Sự nghiệp' : '💼 Career Journey'}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold" style={cardTextColor}>
                  {language === 'vi' ? 'Kỹ sư Phần mềm Cao cấp (2022 - Hiện tại)' : 'Senior Software Engineer (2022 - Present)'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={cardTextColor}>
                  {language === 'vi' 
                    ? 'Lãnh đạo phát triển các ứng dụng doanh nghiệp sử dụng Next.js, React và các công nghệ đám mây.'
                    : 'Leading development of enterprise applications using Next.js, React, and cloud technologies.'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold" style={cardTextColor}>
                  {language === 'vi' ? 'Nhà Phân tích Nghiệp vụ (2020 - 2022)' : 'Business Analyst (2020 - 2022)'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={cardTextColor}>
                  {language === 'vi'
                    ? 'Thu thập yêu cầu, tạo tài liệu và quản lý mối quan hệ với các bên liên quan cho nhiều dự án.'
                    : 'Gathered requirements, created documentation, and managed stakeholder relationships for various projects.'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold" style={cardTextColor}>
                  {language === 'vi' ? 'Lập trình viên Trẻ (2019 - 2020)' : 'Junior Developer (2019 - 2020)'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={cardTextColor}>
                  {language === 'vi'
                    ? 'Bắt đầu hành trình xây dựng ứng dụng web và học các thực hành phát triển hiện đại.'
                    : 'Started my journey building web applications and learning modern development practices.'
                  }
                </p>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>
              {language === 'vi' ? '🎯 Những gì tôi làm' : '🎯 What I Do'}
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-base" style={cardTextColor}>
              {language === 'vi' ? (
                <>
                  <li>Xây dựng ứng dụng web có khả năng mở rộng với các framework hiện đại</li>
                  <li>Phân tích yêu cầu nghiệp vụ và tạo đặc tả kỹ thuật</li>
                  <li>Lãnh đạo nhóm phát triển và hướng dẫn lập trình viên trẻ</li>
                  <li>Triển khai các thực hành tốt nhất cho chất lượng và hiệu suất mã</li>
                  <li>Hợp tác với các bên liên quan để giao dự án thành công</li>
                </>
              ) : (
                <>
                  <li>Build scalable web applications with modern frameworks</li>
                  <li>Analyze business requirements and create technical specifications</li>
                  <li>Lead development teams and mentor junior developers</li>
                  <li>Implement best practices for code quality and performance</li>
                  <li>Collaborate with stakeholders to deliver successful projects</li>
                </>
              )}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>
              {language === 'vi' ? '🛠️ Kỹ năng & Công nghệ' : '🛠️ Skills & Technologies'}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Next.js</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">React</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">TypeScript</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Supabase</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Tailwind CSS</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Node.js</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">PostgreSQL</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {language === 'vi' ? 'Phân tích Nghiệp vụ' : 'Business Analysis'}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {language === 'vi' ? 'Quản lý Dự án' : 'Project Management'}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Agile/Scrum</span>
            </div>
          </section>
        </div>
      </main>
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  )
} 