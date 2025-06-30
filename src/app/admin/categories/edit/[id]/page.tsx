import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import CategoryEditForm from './CategoryEditForm'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
          <CategoryEditForm id={id} />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
} 