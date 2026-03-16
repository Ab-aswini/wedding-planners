'use client'

import Input from '@/components/ui/Input'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

export default function GuestInfoTab({ data, updateField }: Props) {
  return (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-lg font-semibold">Guest Information</h3>

      <Input
        label="Dress Code"
        value={data.dressCode}
        onChange={(e) => updateField('dressCode', e.target.value)}
        placeholder="e.g. Traditional Indian Attire"
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Parking Information</label>
        <textarea
          value={data.parkingInfo}
          onChange={(e) => updateField('parkingInfo', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-card-border bg-transparent text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
          placeholder="e.g. Valet parking available at the main entrance..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Accommodation</label>
        <textarea
          value={data.accommodation}
          onChange={(e) => updateField('accommodation', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-card-border bg-transparent text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
          placeholder="e.g. Rooms available at The Grand Hotel. Use code WEDDING2026..."
        />
      </div>

      {/* RSVP toggle */}
      <div className="border-t border-card-border pt-6">
        <h3 className="text-lg font-semibold mb-4">RSVP Settings</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.showRsvp}
            onChange={(e) => updateField('showRsvp', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show RSVP form on invite</span>
        </label>
        <p className="text-xs text-muted mt-1">
          When enabled, guests can RSVP directly from the invite page.
        </p>
      </div>

      {/* Countdown toggle */}
      <div className="border-t border-card-border pt-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.showCountdown}
            onChange={(e) => updateField('showCountdown', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show countdown timer</span>
        </label>
      </div>
    </div>
  )
}
