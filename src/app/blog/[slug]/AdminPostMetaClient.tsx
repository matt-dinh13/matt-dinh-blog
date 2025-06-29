'use client'

import { useAuth } from '@/components/AuthProvider'

export default function AdminPostMetaClient({ id, status }: { id: number|string, status: string }) {
  const { user } = useAuth()
  if (!user) return null
  return (
    <div className="text-xs text-gray-500">
      ID: {id} | Status: {status}
    </div>
  )
} 