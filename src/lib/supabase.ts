import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please set up your .env.local file.')
    // Return a mock client for development
    return {
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ single: () => ({ data: null, error: null }) }) }) }) }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
        in: () => ({ data: [], error: null })
      }),
      auth: {
        getUser: () => ({ data: { user: null }, error: null }),
        signInWithPassword: () => ({ data: null, error: null }),
        signOut: () => ({ error: null })
      }
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
} 