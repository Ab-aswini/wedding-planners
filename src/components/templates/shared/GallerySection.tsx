'use client'

import { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
}

export default function GallerySection({ data }: Props) {
  if (!data.showGallery || data.photos.length === 0) return null

  return (
    <section className="py-16 px-6" style={{ backgroundColor: data.colors.background }}>
      <div className="max-w-lg mx-auto">
        <h2
          className="text-2xl text-center mb-10 tracking-wider"
          style={{ fontFamily: data.fonts.heading, color: data.colors.accent }}
        >
          Gallery
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {data.photos.map((photo, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-lg ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}
            >
              <img
                src={photo}
                alt={`Wedding photo ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
