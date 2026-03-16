import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const orgName = searchParams.get('org_name')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
              // ignore in server component context
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if user already has an organization
        const { data: existingMembership } = await supabase
          .from('org_members')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .single()

        // If no org exists (new Google signup), create one
        if (!existingMembership) {
          const name = orgName || user.user_metadata?.full_name || 'My Agency'
          const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            + '-' + Math.random().toString(36).substring(2, 6)

          const { data: org } = await supabase
            .from('organizations')
            .insert({
              name,
              slug,
              owner_id: user.id,
            })
            .select('id')
            .single()

          if (org) {
            await supabase.from('org_members').insert({
              org_id: org.id,
              user_id: user.id,
              role: 'owner',
            })
          }
        }
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login`)
}
