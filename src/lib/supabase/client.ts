import { createBrowserClient } from '@supabase/ssr'

const PLACEHOLDER = 'your_supabase_url'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!url && url !== PLACEHOLDER && url.startsWith('http')
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return a mock-like client that won't crash in dev without keys
    return createBrowserClient(
      'http://localhost:54321',
      'placeholder-key'
    )
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
