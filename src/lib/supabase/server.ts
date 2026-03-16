import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const PLACEHOLDER = 'your_supabase_url'

function getUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || url === PLACEHOLDER) return 'http://localhost:54321'
  return url
}

function getAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key || key === 'your_anon_key') return 'placeholder-key'
  return key
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    getUrl(),
    getAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}

export async function createServiceClient() {
  const { createClient } = await import('@supabase/supabase-js')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return createClient(
    getUrl(),
    serviceKey && serviceKey !== 'your_service_role_key' ? serviceKey : 'placeholder-key'
  )
}
