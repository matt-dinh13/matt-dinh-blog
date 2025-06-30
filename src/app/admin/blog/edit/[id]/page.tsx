import { Suspense } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminBlogEditForm from './AdminBlogEditForm'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
          <Suspense fallback={
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          }>
            <AdminBlogEditForm id={id} />
          </Suspense>
        </main>
        <footer className="bg-gray-900 text-white">
          <Footer />
        </footer>
      </div>
    </ProtectedRoute>
  )
} 