'use client'

import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

export default function StoryTab({ data, updateField, updateNested }: Props) {
  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Our Story</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.showStory}
            onChange={(e) => updateField('showStory', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show story section</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">How We Met</label>
        <textarea
          value={data.story.how}
          onChange={(e) => updateNested('story', 'how', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-card-border bg-transparent text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
          placeholder="Tell the story of how you met..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">The Proposal</label>
        <textarea
          value={data.story.proposal}
          onChange={(e) => updateNested('story', 'proposal', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-card-border bg-transparent text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
          placeholder="How did the proposal happen?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Our Motto / Quote</label>
        <textarea
          value={data.story.motto}
          onChange={(e) => updateNested('story', 'motto', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-card-border bg-transparent text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
          placeholder="A favourite quote or motto..."
        />
      </div>
    </div>
  )
}
