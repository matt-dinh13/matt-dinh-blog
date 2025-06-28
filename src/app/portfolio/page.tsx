import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | Matt Dinh',
  description: 'Explore my projects and work in software development and business analysis.',
}

const mockProjects = [
  {
    id: 1,
    title: 'Personal Blog Platform',
    description: 'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS. Features rich text editing, markdown support, and admin panel.',
    thumbnail: '/window.svg',
    slug: 'personal-blog-platform',
  },
  {
    id: 2,
    title: 'Mobile App for Productivity',
    description: 'A cross-platform mobile app to help users manage tasks, set reminders, and track productivity. Built with React Native and Firebase.',
    thumbnail: '/globe.svg',
    slug: 'mobile-app-productivity',
  },
  {
    id: 3,
    title: 'E-commerce Dashboard',
    description: 'A dashboard for managing products, orders, and analytics for an e-commerce platform. Built with Next.js, Chart.js, and Supabase.',
    thumbnail: '/file.svg',
    slug: 'ecommerce-dashboard',
  },
]

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        <h1 className="text-3xl font-bold mb-10 text-center text-white">Portfolio Projects</h1>
        <div className="flex flex-col gap-8">
          {mockProjects.map((project) => (
            <article key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row" style={cardTextColor}>
              <Link href={`/portfolio/${project.slug}`} className="relative w-full md:w-48 h-40 bg-gray-100 dark:bg-gray-700 block group flex-shrink-0">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, 192px"
                  priority
                />
                <span className="sr-only">Go to {project.title}</span>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-lg font-bold mb-2 line-clamp-2" style={cardTextColor}>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    style={cardTextColor}
                    className="block w-full py-1 px-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
                  >
                    <span
                      className="block transition-colors duration-200 group-hover:text-blue-600"
                      style={cardTextColor}
                    >
                      {project.title}
                    </span>
                  </Link>
                </h2>
                <p className="mb-3 line-clamp-3 text-sm" style={cardTextColor}>
                  {project.description}
                </p>
                <Link 
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center font-medium text-sm transition-colors duration-200 hover:text-blue-600"
                  style={cardTextColor}
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  )
} 