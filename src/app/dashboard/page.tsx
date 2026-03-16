'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import StatsCards from '@/components/dashboard/StatsCards'
import InviteCard from '@/components/dashboard/InviteCard'
import Button from '@/components/ui/Button'

interface DashboardStats {
  totalInvites: number
  publishedInvites: number
  totalRsvps: number
  totalViews: number
}

interface InviteRow {
  id: string
  slug: string
  groom_name: string | null
  bride_name: string | null
  wedding_date: string | null
  status: string
  view_count: number
  created_at: string
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({ totalInvites: 0, publishedInvites: 0, totalRsvps: 0, totalViews: 0 })
  const [recentInvites, setRecentInvites] = useState<InviteRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()

      // Fetch invites
      const { data: invites } = await supabase
        .from('invites')
        .select('id, slug, groom_name, bride_name, wedding_date, status, view_count, created_at')
        .order('created_at', { ascending: false })
        .limit(6)

      if (invites) {
        setRecentInvites(invites)

        const totalViews = invites.reduce((sum, i) => sum + (i.view_count || 0), 0)
        const publishedCount = invites.filter((i) => i.status === 'published').length

        // Fetch RSVP count
        const inviteIds = invites.map((i) => i.id)
        const { count: rsvpCount } = await supabase
          .from('rsvps')
          .select('id', { count: 'exact', head: true })
          .in('invite_id', inviteIds)

        setStats({
          totalInvites: invites.length,
          publishedInvites: publishedCount,
          totalRsvps: rsvpCount || 0,
          totalViews,
        })
      }

      setLoading(false)
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/dashboard/invites/new">
          <Button>+ New Invite</Button>
        </Link>
      </div>

      <StatsCards stats={[
        { label: 'Total Invites', value: stats.totalInvites },
        { label: 'Published', value: stats.publishedInvites },
        { label: 'Total RSVPs', value: stats.totalRsvps },
        { label: 'Total Views', value: stats.totalViews },
      ]} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Invites</h2>
          <Link href="/dashboard/invites" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>

        {recentInvites.length === 0 ? (
          <div className="text-center py-16 bg-card-bg border border-card-border rounded-xl">
            <p className="text-muted mb-4">No invites yet. Create your first one!</p>
            <Link href="/dashboard/invites/new">
              <Button>Create Invite</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentInvites.map((invite) => (
              <InviteCard key={invite.id} invite={invite} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
