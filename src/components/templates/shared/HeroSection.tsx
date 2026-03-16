'use client'

import { InviteData } from '@/lib/types'
import { formatDate, daysUntil } from '@/lib/utils'

interface Props {
  data: InviteData
  className?: string
}

export default function HeroSection({ data, className = '' }: Props) {
  const days = daysUntil(data.weddingDate)

  return (
    <section
      className={`relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
      style={{ backgroundColor: data.colors.background, color: data.colors.text }}
    >
      {/* Deity motif / mantra */}
      {data.mantra && (
        <p className="text-sm opacity-70 tracking-widest mb-6" style={{ color: data.colors.accent }}>
          {data.mantra}
        </p>
      )}

      {/* Hero photo */}
      {data.heroPhoto && (
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 mb-8" style={{ borderColor: data.colors.accent }}>
          <img
            src={data.heroPhoto}
            alt={`${data.groomName} & ${data.brideName}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Couple Names */}
      <h1
        className="text-4xl md:text-5xl font-bold leading-tight"
        style={{ fontFamily: data.fonts.heading, color: data.colors.text }}
      >
        {data.groomName || 'Groom'}
      </h1>
      <p className="text-2xl my-2 opacity-60" style={{ color: data.colors.accent }}>&amp;</p>
      <h1
        className="text-4xl md:text-5xl font-bold leading-tight"
        style={{ fontFamily: data.fonts.heading, color: data.colors.text }}
      >
        {data.brideName || 'Bride'}
      </h1>

      {/* Family names */}
      {(data.groomFamily || data.brideFamily) && (
        <p className="mt-4 text-sm opacity-60" style={{ fontFamily: data.fonts.body }}>
          {data.groomFamily && <span>{data.groomFamily}</span>}
          {data.groomFamily && data.brideFamily && <span> &bull; </span>}
          {data.brideFamily && <span>{data.brideFamily}</span>}
        </p>
      )}

      {/* Wedding date */}
      {data.weddingDate && (
        <div className="mt-8">
          <p className="text-lg tracking-wider opacity-80" style={{ fontFamily: data.fonts.body }}>
            {formatDate(data.weddingDate)}
          </p>
          {days > 0 && (
            <p className="mt-2 text-sm opacity-50">
              {days} {days === 1 ? 'day' : 'days'} to go
            </p>
          )}
        </div>
      )}

      {/* Hashtag */}
      {data.hashtag && (
        <p className="mt-6 text-sm tracking-wider" style={{ color: data.colors.accent }}>
          #{data.hashtag}
        </p>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
        </svg>
      </div>
    </section>
  )
}
