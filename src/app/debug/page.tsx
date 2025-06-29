'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkConnection() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const info: any = {}

      // Check environment variables
      info.envVars = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (first 10 chars: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...)' : 'Not set'
      }

      try {
        const supabase = createClient()
        info.clientCreated = 'Success'

        // Test simple query
        const { data: languages, error: langError } = await supabase
          .from('languages')
          .select('*')
          .limit(1)

        info.languagesQuery = {
          success: !langError,
          error: langError,
          data: languages
        }

        // Test blog posts query
        const { data: posts, error: postsError } = await supabase
          .from('blog_posts')
          .select('*')
          .limit(5)

        info.postsQuery = {
          success: !postsError,
          error: postsError,
          data: posts,
          count: posts?.length || 0
        }

        // Test translations query
        const { data: translations, error: transError } = await supabase
          .from('blog_post_translations')
          .select('*')
          .limit(5)

        info.translationsQuery = {
          success: !transError,
          error: transError,
          data: translations,
          count: translations?.length || 0
        }

      } catch (error) {
        info.clientError = error
      }

      setDebugInfo(info)
      setLoading(false)
    }

    checkConnection()
  }, [])

  if (loading) {
    return <div className="p-8">Loading debug info...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Debug Information</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <pre className="text-sm">{JSON.stringify(debugInfo.envVars, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Client Creation</h2>
          <p>{debugInfo.clientCreated || 'Failed'}</p>
          {debugInfo.clientError && (
            <pre className="text-sm text-red-600 mt-2">{JSON.stringify(debugInfo.clientError, null, 2)}</pre>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Languages Query</h2>
          <pre className="text-sm">{JSON.stringify(debugInfo.languagesQuery, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Blog Posts Query</h2>
          <pre className="text-sm">{JSON.stringify(debugInfo.postsQuery, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Translations Query</h2>
          <pre className="text-sm">{JSON.stringify(debugInfo.translationsQuery, null, 2)}</pre>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Next Steps</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Check if environment variables are set correctly</li>
          <li>If no data exists, run the seed script in Supabase SQL Editor</li>
          <li>Check RLS policies if queries are failing</li>
          <li>Verify your Supabase project URL and anon key</li>
        </ol>
      </div>
    </div>
  )
} 