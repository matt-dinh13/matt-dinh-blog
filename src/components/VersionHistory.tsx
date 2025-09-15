'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Clock, RotateCcw, Save, Eye } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Version {
  id: string
  version_number: number
  title_vi: string
  title_en: string
  content_vi: string
  content_en: string
  summary_vi: string
  summary_en: string
  status: string
  category_id: string
  thumbnail_url: string
  created_at: string
  change_summary: string
  is_auto_save: boolean
}

interface VersionHistoryProps {
  postId: string
  onVersionRestore?: () => void
}

export function VersionHistory({ postId, onVersionRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)

  const fetchVersions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/versions?postId=${postId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch versions')
      }
      
      setVersions(data.versions || [])
    } catch (err) {
      logger.error('Failed to fetch versions', { component: 'VersionHistory', error: err as any })
      setError(err instanceof Error ? err.message : 'Failed to fetch versions')
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  const restoreVersion = async (versionId: string) => {
    try {
      const response = await fetch('/api/versions/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to restore version')
      }
      
      // Refresh versions and notify parent
      await fetchVersions()
      onVersionRestore?.()
      
      // Show success message (you could use a toast library here)
      alert('Version restored successfully')
    } catch (err) {
      logger.error('Failed to restore version', { component: 'VersionHistory', error: err as any })
      alert(err instanceof Error ? err.message : 'Failed to restore version')
    }
  }

  const createVersion = async () => {
    const changeSummary = prompt('Enter a description for this version:')
    if (!changeSummary) return

    try {
      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, changeSummary })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create version')
      }
      
      await fetchVersions()
      alert('Version created successfully')
    } catch (err) {
      logger.error('Failed to create version', { component: 'VersionHistory', error: err as any })
      alert(err instanceof Error ? err.message : 'Failed to create version')
    }
  }

  if (loading) {
    return (
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Loading version history...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="text-red-600 dark:text-red-400">
          Error: {error}
        </div>
        <button
          onClick={fetchVersions}
          className="mt-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Version History</span>
          </h3>
          <button
            onClick={createVersion}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <Save className="w-4 h-4" />
            <span>Create Version</span>
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {versions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No versions found. Create your first version to start tracking changes.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {versions.map((version) => (
              <div key={version.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Version {version.version_number}</span>
                      {version.is_auto_save && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                          Auto-save
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {version.change_summary}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Status: {version.status} | 
                      {version.title_vi && ` VI: ${version.title_vi.substring(0, 50)}${version.title_vi.length > 50 ? '...' : ''}`}
                      {version.title_en && ` | EN: ${version.title_en.substring(0, 50)}${version.title_en.length > 50 ? '...' : ''}`}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedVersion(expandedVersion === version.id ? null : version.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => restoreVersion(version.id)}
                      className="p-1 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                      title="Restore this version"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {expandedVersion === version.id && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Vietnamese Title:</strong>
                        <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded text-xs">
                          {version.title_vi || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <strong>English Title:</strong>
                        <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded text-xs">
                          {version.title_en || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <strong>Vietnamese Summary:</strong>
                        <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded text-xs max-h-20 overflow-y-auto">
                          {version.summary_vi || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <strong>English Summary:</strong>
                        <div className="mt-1 p-2 bg-white dark:bg-gray-700 rounded text-xs max-h-20 overflow-y-auto">
                          {version.summary_en || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
