'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  saveNow: () => void
}

export default function PublishTab({ data, saveNow }: Props) {
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  const inviteUrl = `${process.env.NEXT_PUBLIC_INVITE_BASE_URL || ''}/${data.slug}`
  const isPublished = data.status === 'published'

  async function handlePublish() {
    setPublishing(true)
    setError('')
    saveNow()

    try {
      const res = await fetch(`/api/invites/${data.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !isPublished }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to publish')
      }

      // Reload to reflect new status
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPublishing(false)
    }
  }

  // Validation checks
  const checks = [
    { label: 'Groom name', ok: !!data.groomName },
    { label: 'Bride name', ok: !!data.brideName },
    { label: 'Wedding date', ok: !!data.weddingDate },
    { label: 'At least one event', ok: data.events.length > 0 },
  ]
  const allChecked = checks.every((c) => c.ok)

  return (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-lg font-semibold">Publish Your Invite</h3>

      {/* Status badge */}
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
          isPublished ? 'bg-green-500' : 'bg-yellow-500'
        }`} />
        <span className="text-sm font-medium">
          {isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      {/* Checklist */}
      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <p className="text-sm font-medium mb-3">Pre-publish checklist</p>
        <ul className="space-y-2">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center gap-2 text-sm">
              <span className={check.ok ? 'text-green-500' : 'text-muted'}>
                {check.ok ? '✓' : '○'}
              </span>
              <span className={check.ok ? '' : 'text-muted'}>{check.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Publish / Unpublish */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-lg">{error}</p>
      )}

      <Button
        onClick={handlePublish}
        loading={publishing}
        variant={isPublished ? 'outline' : 'primary'}
        className="w-full"
        disabled={!isPublished && !allChecked}
      >
        {isPublished ? 'Unpublish' : 'Publish Invite'}
      </Button>

      {/* Share link */}
      {isPublished && (
        <div className="border border-card-border rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium">Share this link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={inviteUrl}
              className="flex-1 px-3 py-2 text-sm bg-transparent border border-card-border rounded-lg text-foreground"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
            >
              Copy
            </Button>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`You're invited! ${inviteUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Share on WhatsApp
            </a>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 border border-card-border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Open Invite
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
