'use client'

import { useEffect } from 'react'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  templateSlug: string
}

export default function InviteClientPage({ data, templateSlug }: Props) {
  // Log view analytics
  useEffect(() => {
    fetch(`/api/invites/${data.id}/rsvp`, {
      method: 'OPTIONS',
    }).catch(() => {})
  }, [data.id])

  // Listen for postMessage from editor preview
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Only accept messages with invite data updates (for editor preview)
      if (event.data?.type === 'INVITE_DATA_UPDATE') {
        // This will be handled by the preview wrapper, not here in production
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="max-w-[480px] mx-auto min-h-screen shadow-2xl">
      <TemplateRenderer data={data} templateSlug={templateSlug} />
    </div>
  )
}
