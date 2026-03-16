'use client'

import { useEffect, useState } from 'react'
import { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownSection({ data }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(data.weddingDate))

  useEffect(() => {
    if (!data.weddingDate) return
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(data.weddingDate)), 1000)
    return () => clearInterval(timer)
  }, [data.weddingDate])

  if (!data.showCountdown || !data.weddingDate) return null

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ]

  return (
    <section className="py-16 px-6 text-center" style={{ backgroundColor: data.colors.background }}>
      <h2
        className="text-2xl mb-8 tracking-wider opacity-80"
        style={{ fontFamily: data.fonts.heading, color: data.colors.text }}
      >
        Counting Down
      </h2>
      <div className="flex justify-center gap-4 md:gap-8">
        {blocks.map((b) => (
          <div key={b.label} className="flex flex-col items-center">
            <span
              className="text-3xl md:text-5xl font-bold tabular-nums"
              style={{ fontFamily: data.fonts.heading, color: data.colors.accent }}
            >
              {String(b.value).padStart(2, '0')}
            </span>
            <span
              className="text-xs mt-2 uppercase tracking-widest opacity-60"
              style={{ color: data.colors.text, fontFamily: data.fonts.body }}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
