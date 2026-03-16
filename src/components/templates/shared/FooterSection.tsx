'use client'

import { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
}

export default function FooterSection({ data }: Props) {
  return (
    <footer className="py-12 px-6 text-center" style={{ backgroundColor: data.colors.background }}>
      <p
        className="text-lg"
        style={{ fontFamily: data.fonts.heading, color: data.colors.accent }}
      >
        {data.groomName} &hearts; {data.brideName}
      </p>
      {data.hashtag && (
        <p className="mt-2 text-sm opacity-50" style={{ color: data.colors.text }}>
          #{data.hashtag}
        </p>
      )}
      <p className="mt-8 text-[10px] opacity-30" style={{ color: data.colors.text }}>
        Made with InviteForge
      </p>
    </footer>
  )
}
