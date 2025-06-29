'use client'

import { useLanguage } from '@/components/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { Mail, Linkedin, Github, Calendar, Briefcase } from 'lucide-react'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

export default function AboutClient() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "About Me",
      subtitle: "Software Engineer & Business Analyst",
      intro: "Hello! I'm Matt Dinh, a passionate software engineer and business analyst with a love for creating meaningful solutions that bridge technology and business needs.",
      description: "With over 5 years of experience in software development and business analysis, I specialize in building scalable web applications, analyzing business requirements, and translating complex problems into elegant technical solutions.",
      skills: {
        title: "Skills & Expertise",
        technical: "Technical Skills",
        business: "Business Analysis",
        soft: "Soft Skills"
      },
      experience: {
        title: "Professional Experience",
        current: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        period: "2022 - Present",
        description: "Leading development of enterprise web applications, mentoring junior developers, and collaborating with cross-functional teams."
      },
      education: {
        title: "Education",
        degree: "Bachelor of Computer Science",
        university: "University of Technology",
        year: "2019"
      },
      contact: {
        title: "Get In Touch",
        description: "I'm always interested in new opportunities and collaborations. Feel free to reach out!"
      }
    },
    vi: {
      title: "Về Tôi",
      subtitle: "Kỹ Sư Phần Mềm & Phân Tích Viên Kinh Doanh",
      intro: "Xin chào! Tôi là Matt Dinh, một kỹ sư phần mềm và phân tích viên kinh doanh đam mê, với tình yêu tạo ra những giải pháp có ý nghĩa kết nối công nghệ và nhu cầu kinh doanh.",
      description: "Với hơn 5 năm kinh nghiệm trong phát triển phần mềm và phân tích kinh doanh, tôi chuyên về xây dựng các ứng dụng web có khả năng mở rộng, phân tích yêu cầu kinh doanh và chuyển đổi các vấn đề phức tạp thành các giải pháp kỹ thuật thanh lịch.",
      skills: {
        title: "Kỹ Năng & Chuyên Môn",
        technical: "Kỹ Năng Kỹ Thuật",
        business: "Phân Tích Kinh Doanh",
        soft: "Kỹ Năng Mềm"
      },
      experience: {
        title: "Kinh Nghiệm Chuyên Môn",
        current: "Kỹ Sư Phần Mềm Cao Cấp",
        company: "Tech Solutions Inc.",
        period: "2022 - Hiện Tại",
        description: "Lãnh đạo phát triển các ứng dụng web doanh nghiệp, hướng dẫn các lập trình viên trẻ và hợp tác với các nhóm đa chức năng."
      },
      education: {
        title: "Học Vấn",
        degree: "Cử Nhân Khoa Học Máy Tính",
        university: "Đại Học Công Nghệ",
        year: "2019"
      },
      contact: {
        title: "Liên Hệ",
        description: "Tôi luôn quan tâm đến những cơ hội mới và sự hợp tác. Hãy liên hệ với tôi!"
      }
    }
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={cardTextColor}>
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {currentContent.subtitle}
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

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <p className="text-lg mb-4" style={cardTextColor}>
              {currentContent.intro}
            </p>
            <p className="text-lg" style={cardTextColor}>
              {currentContent.description}
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={cardTextColor}>
            {currentContent.skills.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4" style={cardTextColor}>
                {currentContent.skills.technical}
              </h3>
              <ul className="space-y-2" style={cardTextColor}>
                <li>• JavaScript/TypeScript</li>
                <li>• React/Next.js</li>
                <li>• Node.js/Python</li>
                <li>• PostgreSQL/MongoDB</li>
                <li>• Docker/AWS</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4" style={cardTextColor}>
                {currentContent.skills.business}
              </h3>
              <ul className="space-y-2" style={cardTextColor}>
                <li>• Requirements Gathering</li>
                <li>• Process Modeling</li>
                <li>• Stakeholder Management</li>
                <li>• Data Analysis</li>
                <li>• Project Management</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4" style={cardTextColor}>
                {currentContent.skills.soft}
              </h3>
              <ul className="space-y-2" style={cardTextColor}>
                <li>• Problem Solving</li>
                <li>• Communication</li>
                <li>• Team Leadership</li>
                <li>• Critical Thinking</li>
                <li>• Adaptability</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experience & Education */}
        <section className="mb-12">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-6" style={cardTextColor}>
                {currentContent.experience.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase size={16} className="text-blue-600" />
                    <h3 className="font-semibold" style={cardTextColor}>
                      {currentContent.experience.current}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {currentContent.experience.company}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {currentContent.experience.period}
                  </p>
                  <p className="text-sm" style={cardTextColor}>
                    {currentContent.experience.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-6" style={cardTextColor}>
                {currentContent.education.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-green-600" />
                    <h3 className="font-semibold" style={cardTextColor}>
                      {currentContent.education.degree}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {currentContent.education.university}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentContent.education.year}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4" style={cardTextColor}>
              {currentContent.contact.title}
            </h2>
            <p className="text-lg mb-6" style={cardTextColor}>
              {currentContent.contact.description}
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