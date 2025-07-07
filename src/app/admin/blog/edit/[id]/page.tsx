import { Suspense } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminBlogEditForm from './AdminBlogEditForm'
import AdminLayout from '@/components/AdminLayout'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params

  return (
    <ProtectedRoute>
      <AdminLayout title="Edit Blog Post">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          }>
            <AdminBlogEditForm id={id} />
          </Suspense>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 