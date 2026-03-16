'use client'

import { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
}

export default function DetailsSection({ data }: Props) {
  const details = [
    { label: 'Dress Code', value: data.dressCode },
    { label: 'Parking', value: data.parkingInfo },
    { label: 'Accommodation', value: data.accommodation },
  ].filter((d) => d.value)

  // Include additional info key-value pairs
  const additionalEntries = Object.entries(data.additionalInfo || {}).filter(([, v]) => v)

  if (details.length === 0 && additionalEntries.length === 0) return null

  return (
    <section className="py-16 px-6" style={{ backgroundColor: data.colors.background }}>
      <div className="max-w-lg mx-auto">
        <h2
          className="text-2xl text-center mb-10 tracking-wider"
          style={{ fontFamily: data.fonts.heading, color: data.colors.accent }}
        >
          Details
        </h2>
        <div className="space-y-6">
          {details.map((d) => (
            <div key={d.label} className="text-center">
              <h3
                className="text-sm uppercase tracking-wider mb-1 opacity-60"
                style={{ color: data.colors.text, fontFamily: data.fonts.body }}
              >
                {d.label}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: data.colors.text, fontFamily: data.fonts.body }}
              >
                {d.value}
              </p>
            </div>
          ))}
          {additionalEntries.map(([key, value]) => (
            <div key={key} className="text-center">
              <h3
                className="text-sm uppercase tracking-wider mb-1 opacity-60"
                style={{ color: data.colors.text, fontFamily: data.fonts.body }}
              >
                {key}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: data.colors.text, fontFamily: data.fonts.body }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
