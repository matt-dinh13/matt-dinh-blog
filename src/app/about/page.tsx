import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Matt Dinh',
  description: 'Learn more about Matt Dinh - software engineer, business analyst, and technology enthusiast.',
}

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center" style={cardTextColor}>About Me</h1>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>👋 Hi, I&apos;m Matt Dinh</h2>
            <p className="mb-4 text-base" style={cardTextColor}>
              I&apos;m a passionate software engineer and business analyst with over 5 years of experience in building modern web and mobile applications. I love sharing knowledge, writing about my journey, and helping others grow in their careers.
            </p>
            <p className="mb-4 text-base" style={cardTextColor}>
              When I&apos;m not coding or analyzing business requirements, you can find me exploring new technologies, contributing to open-source projects, or mentoring junior developers. I believe in continuous learning and staying up-to-date with the latest industry trends.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>💼 Career Journey</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold" style={cardTextColor}>Senior Software Engineer (2022 - Present)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={cardTextColor}>Leading development of enterprise applications using Next.js, React, and cloud technologies.</p>
              </div>
              <div>
                <h3 className="font-semibold" style={cardTextColor}>Business Analyst (2020 - 2022)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={cardTextColor}>Gathered requirements, created documentation, and managed stakeholder relationships for various projects.</p>
              </div>
              <div>
                <h3 className="font-semibold" style={cardTextColor}>Junior Developer (2019 - 2020)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={cardTextColor}>Started my journey building web applications and learning modern development practices.</p>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>🎯 What I Do</h2>
            <ul className="list-disc pl-5 space-y-2 text-base" style={cardTextColor}>
              <li>Build scalable web applications with modern frameworks</li>
              <li>Analyze business requirements and create technical specifications</li>
              <li>Lead development teams and mentor junior developers</li>
              <li>Implement best practices for code quality and performance</li>
              <li>Collaborate with stakeholders to deliver successful projects</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2" style={cardTextColor}>🛠️ Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Next.js</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">React</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">TypeScript</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Supabase</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Tailwind CSS</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Node.js</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">PostgreSQL</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Business Analysis</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Project Management</span>
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