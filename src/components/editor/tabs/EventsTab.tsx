'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { InviteData, EventData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

const EVENT_PRESETS = ['Haldi', 'Mehndi', 'Sangeet', 'Wedding Ceremony', 'Reception', 'Nikah', 'Walima', 'Anand Karaj']

function createEmptyEvent(name: string, sortOrder: number): EventData {
  return {
    id: crypto.randomUUID(),
    name,
    date: '',
    timeText: '',
    venueName: '',
    venueCity: '',
    mapLink: '',
    accentColor: '',
    sortOrder,
    isPrivate: false,
    guestGroup: 'all',
  }
}

export default function EventsTab({ data, updateField }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function addEvent(name: string) {
    const newEvent = createEmptyEvent(name, data.events.length)
    updateField('events', [...data.events, newEvent])
    setExpandedId(newEvent.id)
  }

  function updateEvent(id: string, field: keyof EventData, value: unknown) {
    updateField(
      'events',
      data.events.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )
  }

  function removeEvent(id: string) {
    updateField('events', data.events.filter((e) => e.id !== id))
  }

  function moveEvent(id: string, direction: 'up' | 'down') {
    const idx = data.events.findIndex((e) => e.id === id)
    if (idx < 0) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= data.events.length) return
    const updated = [...data.events]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    updated.forEach((e, i) => (e.sortOrder = i))
    updateField('events', updated)
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Quick add presets */}
      <div>
        <label className="block text-sm font-medium mb-2">Quick Add Event</label>
        <div className="flex flex-wrap gap-2">
          {EVENT_PRESETS.map((name) => (
            <button
              key={name}
              onClick={() => addEvent(name)}
              className="px-3 py-1.5 text-xs border border-card-border rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              + {name}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="space-y-3">
        {data.events
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((event) => (
          <div key={event.id} className="border border-card-border rounded-lg overflow-hidden">
            {/* Event header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
            >
              <span className="text-sm font-medium">{event.name || 'Untitled Event'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); moveEvent(event.id, 'up') }}
                  className="text-muted hover:text-foreground text-xs"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveEvent(event.id, 'down') }}
                  className="text-muted hover:text-foreground text-xs"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeEvent(event.id) }}
                  className="text-red-400 hover:text-red-500 text-xs"
                >
                  ✕
                </button>
                <svg
                  className={`w-4 h-4 text-muted transition-transform ${expandedId === event.id ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Event details */}
            {expandedId === event.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-card-border pt-3">
                <Input
                  label="Event Name"
                  value={event.name}
                  onChange={(e) => updateEvent(event.id, 'name', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Date"
                    type="date"
                    value={event.date}
                    onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                  />
                  <Input
                    label="Time"
                    value={event.timeText}
                    onChange={(e) => updateEvent(event.id, 'timeText', e.target.value)}
                    placeholder="e.g. 6:00 PM onwards"
                  />
                </div>
                <Input
                  label="Venue Name"
                  value={event.venueName}
                  onChange={(e) => updateEvent(event.id, 'venueName', e.target.value)}
                  placeholder="e.g. The Grand Ballroom"
                />
                <Input
                  label="Venue City"
                  value={event.venueCity}
                  onChange={(e) => updateEvent(event.id, 'venueCity', e.target.value)}
                  placeholder="e.g. Mumbai"
                />
                <Input
                  label="Google Maps Link"
                  value={event.mapLink}
                  onChange={(e) => updateEvent(event.id, 'mapLink', e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`private-${event.id}`}
                    checked={event.isPrivate}
                    onChange={(e) => updateEvent(event.id, 'isPrivate', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor={`private-${event.id}`} className="text-sm text-muted">
                    Private event (hidden from public invite)
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.events.length === 0 && (
        <p className="text-sm text-muted text-center py-8">
          No events added yet. Use the quick add buttons above or add a custom event.
        </p>
      )}

      <Button variant="outline" onClick={() => addEvent('')} className="w-full">
        + Add Custom Event
      </Button>
    </div>
  )
}
