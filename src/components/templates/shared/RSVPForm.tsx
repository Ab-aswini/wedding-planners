'use client'

import { useState } from 'react'
import { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
}

export default function RSVPForm({ data }: Props) {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!data.showRsvp) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (attending === null) return
    setLoading(true)

    try {
      const res = await fetch(`/api/invites/${data.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: name,
          attending,
          guestCount,
          message,
          phone,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-16 px-6 text-center" style={{ backgroundColor: data.colors.background }}>
        <div className="max-w-sm mx-auto">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: data.fonts.heading, color: data.colors.text }}>
            Thank You!
          </h3>
          <p className="text-sm opacity-70" style={{ color: data.colors.text, fontFamily: data.fonts.body }}>
            Your response has been recorded. We look forward to celebrating with you!
          </p>
        </div>
      </section>
    )
  }

  const inputStyle = {
    backgroundColor: 'transparent',
    borderColor: data.colors.accent + '40',
    color: data.colors.text,
    fontFamily: data.fonts.body,
  }

  return (
    <section className="py-16 px-6" style={{ backgroundColor: data.colors.background }}>
      <div className="max-w-sm mx-auto">
        <h2
          className="text-2xl text-center mb-8 tracking-wider"
          style={{ fontFamily: data.fonts.heading, color: data.colors.accent }}
        >
          RSVP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border text-sm"
            style={inputStyle}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className="flex-1 py-3 rounded-lg border text-sm transition-all"
              style={{
                ...inputStyle,
                backgroundColor: attending === true ? data.colors.accent : 'transparent',
                color: attending === true ? '#fff' : data.colors.text,
                borderColor: data.colors.accent,
              }}
            >
              Joyfully Accept
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className="flex-1 py-3 rounded-lg border text-sm transition-all"
              style={{
                ...inputStyle,
                backgroundColor: attending === false ? data.colors.accent + '60' : 'transparent',
                borderColor: data.colors.accent,
              }}
            >
              Regretfully Decline
            </button>
          </div>

          {attending && (
            <div>
              <label className="text-xs opacity-60 block mb-1" style={{ color: data.colors.text }}>
                Number of Guests
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border text-sm"
                style={inputStyle}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-sm"
            style={inputStyle}
          />

          <textarea
            placeholder="Leave a message for the couple..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border text-sm resize-none"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading || !name || attending === null}
            className="w-full py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
            style={{
              backgroundColor: data.colors.accent,
              color: '#fff',
              fontFamily: data.fonts.body,
            }}
          >
            {loading ? 'Sending...' : 'Send RSVP'}
          </button>
        </form>
      </div>
    </section>
  )
}
