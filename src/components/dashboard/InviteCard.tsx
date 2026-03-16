'use client'

import Link from 'next/link'

interface Props {
  invite: {
    id: string
    slug: string
    groom_name: string | null
    bride_name: string | null
    wedding_date: string | null
    status: string
    view_count: number
    created_at: string
  }
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}

export default function InviteCard({ invite }: Props) {
  const title = invite.groom_name && invite.bride_name
    ? `${invite.groom_name} & ${invite.bride_name}`
    : 'Untitled Invite'

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold truncate pr-4">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[invite.status] || STATUS_STYLES.draft}`}>
          {invite.status}
        </span>
      </div>

      {invite.wedding_date && (
        <p className="text-sm text-muted mb-1">
          {new Date(invite.wedding_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      )}

      <p className="text-xs text-muted mb-4">
        {invite.view_count} views &bull; /{invite.slug}
      </p>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/invites/${invite.id}/edit`}
          className="flex-1 text-center text-sm py-1.5 rounded-lg bg-accent text-white hover:bg-accent-light transition-colors"
        >
          Edit
        </Link>
        <Link
          href={`/dashboard/invites/${invite.id}/rsvps`}
          className="flex-1 text-center text-sm py-1.5 rounded-lg border border-card-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          RSVPs
        </Link>
        {invite.status === 'published' && (
          <a
            href={`/i/${invite.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm py-1.5 px-3 rounded-lg border border-card-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View
          </a>
        )}
      </div>
    </div>
  )
}
