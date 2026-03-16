'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { getDefaultInviteData } from '@/lib/utils'
import type { InviteData } from '@/lib/types'

function PreviewContent() {
  const searchParams = useSearchParams()
  const templateSlug = searchParams.get('template') || 'city'
  const [data, setData] = useState<InviteData>(getDefaultInviteData() as InviteData)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'INVITE_DATA_UPDATE') {
        setData(event.data.data)
      }
    }

    window.addEventListener('message', handleMessage)

    // Signal to parent that iframe is ready
    window.parent?.postMessage({ type: 'PREVIEW_READY' }, '*')

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="min-h-screen">
      <TemplateRenderer data={data} templateSlug={templateSlug} />
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PreviewContent />
    </Suspense>
  )
}
