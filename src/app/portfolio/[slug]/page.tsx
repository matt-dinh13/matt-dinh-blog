import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const mockProjects = [
  {
    slug: 'personal-blog-platform',
    title: 'Personal Blog Platform',
    description: 'A modern, customizable blog platform built with Next.js, Supabase, and Tailwind CSS. Features rich text editing, markdown support, and admin panel.',
    thumbnail: '/window.svg',
    details: 'This project demonstrates a full-featured blog platform with authentication, admin panel, and SEO best practices.'
  },
  {
    slug: 'mobile-app-productivity',
    title: 'Mobile App for Productivity',
    description: 'A cross-platform mobile app to help users manage tasks, set reminders, and track productivity. Built with React Native and Firebase.',
    thumbnail: '/globe.svg',
    details: 'The app includes task management, reminders, and analytics to help users stay productive.'
  },
  {
    slug: 'ecommerce-dashboard',
    title: 'E-commerce Dashboard',
    description: 'A dashboard for managing products, orders, and analytics for an e-commerce platform. Built with Next.js, Chart.js, and Supabase.',
    thumbnail: '/file.svg',
    details: 'This dashboard provides real-time analytics and management tools for e-commerce businesses.'
  },
]

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = mockProjects.find(p => p.slug === slug)
  if (!project) return notFound()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        <Link href="/portfolio" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Portfolio</Link>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-6" style={cardTextColor}>
          <div className="flex flex-col items-center mb-6">
            <Image
              src={project.thumbnail}
              alt={project.title}
              width={120}
              height={120}
              className="object-contain mb-4"
              priority
            />
            <h1 className="text-2xl font-bold mb-2 text-center" style={cardTextColor}>{project.title}</h1>
            <p className="text-base mb-2 text-center" style={cardTextColor}>{project.description}</p>
          </div>
          <div className="prose prose-blue max-w-none" style={cardTextColor}>
            <p>{project.details}</p>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  )
} 