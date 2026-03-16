'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Organization } from '@/lib/types'

export function useOrganization() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrg() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data: membership } = await supabase
        .from('org_members')
        .select('org_id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (!membership) {
        setLoading(false)
        return
      }

      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', membership.org_id)
        .single()

      if (orgData) {
        setOrg({
          id: orgData.id,
          name: orgData.name,
          slug: orgData.slug,
          plan: orgData.plan,
          planExpires: orgData.plan_expires,
          inviteLimit: orgData.invite_limit,
          brandColor: orgData.brand_color,
          logoUrl: orgData.logo_url,
        })
      }

      setLoading(false)
    }

    fetchOrg()
  }, [])

  return { org, loading }
}
