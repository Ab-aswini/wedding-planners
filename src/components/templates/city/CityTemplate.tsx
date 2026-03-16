'use client'

import { InviteData } from '@/lib/types'
import HeroSection from '../shared/HeroSection'
import CountdownSection from '../shared/CountdownSection'
import StorySection from '../shared/StorySection'
import EventsSection from '../shared/EventsSection'
import GallerySection from '../shared/GallerySection'
import RSVPForm from '../shared/RSVPForm'
import DetailsSection from '../shared/DetailsSection'
import FooterSection from '../shared/FooterSection'
import MusicToggle from '../shared/MusicToggle'

interface Props {
  data: InviteData
}

export default function CityTemplate({ data }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: data.colors.background,
        color: data.colors.text,
        fontFamily: data.fonts.body,
      }}
    >
      {/* Decorative top border */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${data.colors.accent}, transparent)`,
        }}
      />

      <HeroSection data={data} />

      {/* Ornamental divider */}
      <div className="flex items-center justify-center py-4" style={{ color: data.colors.accent }}>
        <div className="h-px w-16 opacity-30" style={{ backgroundColor: data.colors.accent }} />
        <svg className="mx-4 opacity-50" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <div className="h-px w-16 opacity-30" style={{ backgroundColor: data.colors.accent }} />
      </div>

      <CountdownSection data={data} />
      <StorySection data={data} />
      <EventsSection data={data} />
      <GallerySection data={data} />

      {/* Deity motif before RSVP */}
      {data.deityMotif !== 'none' && (
        <div className="py-8 text-center">
          <span className="text-3xl opacity-30" style={{ color: data.colors.accent }}>
            {data.deityMotif === 'ganesha' && '🙏'}
            {data.deityMotif === 'bismillah' && '☪️'}
            {data.deityMotif === 'cross' && '✝️'}
            {data.deityMotif === 'khanda' && '☬'}
          </span>
        </div>
      )}

      <RSVPForm data={data} />
      <DetailsSection data={data} />
      <FooterSection data={data} />
      <MusicToggle data={data} />
    </div>
  )
}
