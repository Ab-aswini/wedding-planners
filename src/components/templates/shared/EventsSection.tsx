'use client'

import { InviteData } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface Props {
  data: InviteData
}

export default function EventsSection({ data }: Props) {
  if (data.events.length === 0) return null

  const visibleEvents = data.events
    .filter((e) => !e.isPrivate)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  if (visibleEvents.length === 0) return null

  return (
    <section className="py-16 px-6" style={{ backgroundColor: data.colors.background }}>
      <div className="max-w-lg mx-auto">
        <h2
          className="text-2xl text-center mb-12 tracking-wider"
          style={{ fontFamily: data.fonts.heading, color: data.colors.accent }}
        >
          Wedding Events
        </h2>
        <div className="space-y-8">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="relative pl-8 border-l-2"
              style={{ borderColor: event.accentColor || data.colors.accent }}
            >
              <div
                className="absolute left-[-7px] top-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: event.accentColor || data.colors.accent }}
              />
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: data.fonts.heading, color: data.colors.text }}
              >
                {event.name}
              </h3>
              {event.date && (
                <p className="text-sm mt-1 opacity-70" style={{ color: data.colors.text, fontFamily: data.fonts.body }}>
                  {formatDate(event.date)}
                  {event.timeText && ` \u2022 ${event.timeText}`}
                </p>
              )}
              {event.venueName && (
                <p className="text-sm mt-1 opacity-60" style={{ color: data.colors.text, fontFamily: data.fonts.body }}>
                  {event.venueName}
                  {event.venueCity && `, ${event.venueCity}`}
                </p>
              )}
              {event.mapLink && (
                <a
                  href={event.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs underline opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: data.colors.accent }}
                >
                  View on Map &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
