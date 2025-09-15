import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function I18nCoverageReportPage() {
  const supabase = await createServerSupabaseClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug,
      status,
      blog_post_translations(language_code, title)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Translation Coverage</h1>
          <div className="text-red-600">Failed to load posts: {error.message}</div>
        </div>
      </AdminLayout>
    )
  }

  const rows = (posts || []).map((p: any) => {
    const codes = new Set((p.blog_post_translations || []).map((t: any) => t.language_code))
    const hasVi = codes.has('vi')
    const hasEn = codes.has('en')
    return { id: p.id, slug: p.slug, status: p.status, hasVi, hasEn }
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Translation Coverage</h1>
          <div className="text-sm text-gray-500">Total: {rows.length}</div>
        </div>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Slug</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">vi</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">en</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{r.id}</td>
                  <td className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400">
                    <Link href={`/blog/${r.slug}`} target="_blank" className="hover:underline">{r.slug}</Link>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${r.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${r.hasVi ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{r.hasVi ? 'OK' : 'Missing'}</span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${r.hasEn ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{r.hasEn ? 'OK' : 'Missing'}</span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog/edit/${r.id}`} className="text-blue-600 hover:underline">Edit</Link>
                      <Link href={`/blog/${r.slug}`} target="_blank" className="text-gray-600 hover:underline">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
} 