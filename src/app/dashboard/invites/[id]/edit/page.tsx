'use client'

import { useParams } from 'next/navigation'
import { useInvite } from '@/hooks/useInvite'
import EditorLayout from '@/components/editor/EditorLayout'

export default function EditInvitePage() {
  const params = useParams()
  const inviteId = params.id as string
  const { data, loading, error, saveStatus, updateField, updateNested, saveNow } = useInvite(inviteId)

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted">Loading invite...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500 mb-2">Error</p>
          <p className="text-sm text-muted">{error || 'Invite not found'}</p>
          <a href="/dashboard/invites" className="text-sm text-accent hover:underline mt-4 inline-block">
            Back to invites
          </a>
        </div>
      </div>
    )
  }

  // Determine template slug (default to 'city')
  const templateSlug = 'city'

  return (
    <EditorLayout
      data={data}
      templateSlug={templateSlug}
      saveStatus={saveStatus}
      updateField={updateField}
      updateNested={updateNested}
      saveNow={saveNow}
    />
  )
}
