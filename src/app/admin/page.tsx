import ProtectedRoute from '@/components/ProtectedRoute'
import AdminLayout from '@/components/AdminLayout'
import AdminDashboard from '@/components/AdminDashboard'
import { Metadata } from 'next'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Matt Dinh',
  description: 'Admin dashboard for managing blog posts, categories, and portfolio projects.',
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="Dashboard" subtitle="Overview of your content and statistics">
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  )
} 