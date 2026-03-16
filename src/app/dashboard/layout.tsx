'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/dashboard/Sidebar'
import { useOrganization } from '@/hooks/useOrganization'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { org, loading: orgLoading } = useOrganization()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [router])

  if (!authChecked || orgLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar org={org} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
