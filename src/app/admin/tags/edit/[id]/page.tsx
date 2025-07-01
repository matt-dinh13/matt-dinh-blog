import { Suspense } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminLayout from '@/components/AdminLayout'
import TagEditForm from './TagEditForm'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditTagPage({ params }: Props) {
  const { id } = await params

  return (
    <ProtectedRoute>
      <AdminLayout title="Edit Tag" subtitle="Update tag information">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        }>
          <TagEditForm id={id} />
        </Suspense>
      </AdminLayout>
    </ProtectedRoute>
  )
} 