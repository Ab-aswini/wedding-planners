'use client'

import { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
}

export default function StorySection({ data }: Props) {
  if (!data.showStory) return null

  const { story } = data
  if (!story.how && !story.proposal && !story.motto) return null

  const sections = [
    { title: 'How We Met', content: story.how },
    { title: 'The Proposal', content: story.proposal },
    { title: 'Our Motto', content: story.motto },
  ].filter((s) => s.content)

  return (
    <section className="py-16 px-6" style={{ backgroundColor: data.colors.background }}>
      <div className="max-w-lg mx-auto text-center">
        <h2
          className="text-2xl mb-12 tracking-wider"
          style={{ fontFamily: data.fonts.heading, color: data.colors.accent }}
        >
          Our Story
        </h2>
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: data.fonts.heading, color: data.colors.text }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed opacity-80"
                style={{ fontFamily: data.fonts.body, color: data.colors.text }}
              >
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
