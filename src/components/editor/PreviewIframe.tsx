'use client'

import { useEffect, useRef } from 'react'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  templateSlug: string
}

export default function PreviewIframe({ data, templateSlug }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Send data to iframe via postMessage whenever data changes
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return

    // Small delay to ensure iframe is ready
    const timer = setTimeout(() => {
      iframe.contentWindow?.postMessage(
        { type: 'INVITE_DATA_UPDATE', data, templateSlug },
        window.location.origin
      )
    }, 100)

    return () => clearTimeout(timer)
  }, [data, templateSlug])

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400">Preview</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="flex-1 overflow-auto flex justify-center bg-gray-900 p-4">
        <div className="w-[375px] h-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <iframe
            ref={iframeRef}
            src={`/i/preview?template=${templateSlug}`}
            className="w-full h-full border-0"
            title="Invite Preview"
          />
        </div>
      </div>
    </div>
  )
}
