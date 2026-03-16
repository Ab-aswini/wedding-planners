'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

interface RSVPRow {
  id: string
  guest_name: string
  attending: boolean | null
  guest_count: number
  message: string | null
  phone: string | null
  created_at: string
}

export default function RSVPsPage() {
  const params = useParams()
  const inviteId = params.id as string
  const [rsvps, setRsvps] = useState<RSVPRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invite_id', inviteId)
        .order('created_at', { ascending: false })

      if (data) setRsvps(data)
      setLoading(false)
    }
    load()
  }, [inviteId])

  const attending = rsvps.filter((r) => r.attending === true)
  const declined = rsvps.filter((r) => r.attending === false)
  const totalGuests = attending.reduce((sum, r) => sum + (r.guest_count || 1), 0)

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
        <div>
          <h1 className="text-2xl font-bold">RSVPs</h1>
          <p className="text-muted text-sm mt-1">
            {attending.length} attending &bull; {declined.length} declined &bull; {totalGuests} total guests
          </p>
        </div>
        <a href={`/dashboard/invites/${inviteId}/edit`}>
          <Button variant="outline" size="sm">Back to Editor</Button>
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{attending.length}</p>
          <p className="text-xs text-green-600/70">Attending</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{declined.length}</p>
          <p className="text-xs text-red-600/70">Declined</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalGuests}</p>
          <p className="text-xs text-blue-600/70">Total Guests</p>
        </div>
      </div>

      {/* Table */}
      {rsvps.length === 0 ? (
        <div className="text-center py-16 bg-card-bg border border-card-border rounded-xl">
          <p className="text-muted">No RSVPs yet. Share the invite link to start collecting responses.</p>
        </div>
      ) : (
        <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-medium">Guest</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Guests</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Message</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-card-border last:border-0">
                    <td className="px-4 py-3 font-medium">{rsvp.guest_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        rsvp.attending
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {rsvp.attending ? 'Attending' : 'Declined'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{rsvp.guest_count}</td>
                    <td className="px-4 py-3 text-muted">{rsvp.phone || '-'}</td>
                    <td className="px-4 py-3 text-muted max-w-[200px] truncate">{rsvp.message || '-'}</td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(rsvp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
