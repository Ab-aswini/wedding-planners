'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import InviteCard from '@/components/dashboard/InviteCard'
import Button from '@/components/ui/Button'

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

export default function InviteListPage() {
  const [invites, setInvites] = useState<InviteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('invites')
        .select('id, slug, groom_name, bride_name, wedding_date, status, view_count, created_at')
        .order('created_at', { ascending: false })

      if (data) setInvites(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all' ? invites : invites.filter((i) => i.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invites</h1>
        <Link href="/dashboard/invites/new">
          <Button>+ New Invite</Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'draft', 'published', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors capitalize ${
              filter === f
                ? 'bg-accent text-white'
                : 'text-muted hover:text-foreground border border-card-border'
            }`}
          >
            {f} {f !== 'all' && `(${invites.filter((i) => i.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card-bg border border-card-border rounded-xl">
          <p className="text-muted mb-4">
            {filter === 'all' ? 'No invites yet.' : `No ${filter} invites.`}
          </p>
          {filter === 'all' && (
            <Link href="/dashboard/invites/new">
              <Button>Create Your First Invite</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((invite) => (
            <InviteCard key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  )
}
