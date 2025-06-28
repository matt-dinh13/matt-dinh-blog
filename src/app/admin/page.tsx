import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminContent from '@/components/AdminContent'
import { Metadata } from 'next'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Panel | Matt Dinh',
  description: 'Admin panel for managing blog posts and portfolio projects.',
}

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <AdminContent />
        <footer className="bg-gray-900 text-white">
          <Footer />
        </footer>
      </div>
    </ProtectedRoute>
  )
} 