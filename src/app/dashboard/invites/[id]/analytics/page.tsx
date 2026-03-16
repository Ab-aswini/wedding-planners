'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StatsCards from '@/components/dashboard/StatsCards'
import Button from '@/components/ui/Button'

interface ViewRow {
  id: string
  referrer: string | null
  user_agent: string | null
  viewed_at: string
}

export default function AnalyticsPage() {
  const params = useParams()
  const inviteId = params.id as string
  const [views, setViews] = useState<ViewRow[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      // Get invite view count
      const { data: invite } = await supabase
        .from('invites')
        .select('view_count')
        .eq('id', inviteId)
        .single()

      if (invite) setTotalViews(invite.view_count || 0)

      // Get recent views
      const { data: viewData } = await supabase
        .from('invite_views')
        .select('*')
        .eq('invite_id', inviteId)
        .order('viewed_at', { ascending: false })
        .limit(50)

      if (viewData) setViews(viewData)

      // Get RSVP count
      const { count } = await supabase
        .from('rsvps')
        .select('id', { count: 'exact', head: true })
        .eq('invite_id', inviteId)

      setRsvpCount(count || 0)
      setLoading(false)
    }
    load()
  }, [inviteId])

  // Calculate views per day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const viewsByDay = last7Days.map((day) => ({
    day: new Date(day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
    count: views.filter((v) => v.viewed_at.startsWith(day)).length,
  }))

  const maxCount = Math.max(...viewsByDay.map((d) => d.count), 1)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <a href={`/dashboard/invites/${inviteId}/edit`}>
          <Button variant="outline" size="sm">Back to Editor</Button>
        </a>
      </div>

      <StatsCards stats={[
        { label: 'Total Views', value: totalViews },
        { label: 'RSVPs', value: rsvpCount },
        { label: 'Conversion', value: totalViews > 0 ? `${Math.round((rsvpCount / totalViews) * 100)}%` : '0%' },
        { label: 'Views (7d)', value: views.length },
      ]} />

      {/* Simple bar chart */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <h2 className="text-sm font-medium mb-4">Views — Last 7 Days</h2>
        <div className="flex items-end gap-2 h-32">
          {viewsByDay.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted">{d.count}</span>
              <div
                className="w-full rounded-t-sm bg-accent/80 transition-all"
                style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '4px' : '0px' }}
              />
              <span className="text-[10px] text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referrer breakdown */}
      {views.length > 0 && (
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-sm font-medium mb-4">Top Referrers</h2>
          <div className="space-y-2">
            {Object.entries(
              views.reduce((acc, v) => {
                const ref = v.referrer || 'Direct'
                acc[ref] = (acc[ref] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([referrer, count]) => (
                <div key={referrer} className="flex items-center justify-between text-sm">
                  <span className="text-muted truncate max-w-[300px]">{referrer}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
