'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { generateSlug } from '@/lib/utils'

interface TemplateRow {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
  preview_img: string | null
  is_premium: boolean
}

export default function NewInvitePage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadTemplates() {
      const res = await fetch('/api/templates')
      if (res.ok) {
        const data = await res.json()
        setTemplates(data)
      }
      setLoading(false)
    }
    loadTemplates()
  }, [])

  async function handleCreate() {
    if (!selectedId) return
    setCreating(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get user's org
    const { data: membership } = await supabase
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!membership) return

    const slug = generateSlug('groom', 'bride')

    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId: membership.org_id,
        templateId: selectedId,
        slug,
      }),
    })

    if (res.ok) {
      const invite = await res.json()
      router.push(`/dashboard/invites/${invite.id}/edit`)
    }

    setCreating(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Choose a Template</h1>
        <p className="text-muted mt-1">Select a template to start building your wedding invite.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 bg-card-bg border border-card-border rounded-xl">
          <p className="text-muted mb-2">No templates available yet.</p>
          <p className="text-sm text-muted">Templates will appear here once they are added to the database.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedId(template.id)}
                className={`text-left bg-card-bg border rounded-xl overflow-hidden transition-all ${
                  selectedId === template.id
                    ? 'border-accent ring-2 ring-accent/30'
                    : 'border-card-border hover:border-accent/40'
                }`}
              >
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {template.preview_img ? (
                    <img src={template.preview_img} alt={template.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl opacity-20">🎨</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{template.name}</h3>
                    {template.is_premium && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">Pro</span>
                    )}
                  </div>
                  <p className="text-sm text-muted capitalize">{template.category}</p>
                  {template.description && (
                    <p className="text-xs text-muted mt-1">{template.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm py-4 border-t border-card-border -mx-8 px-8">
            <Button
              onClick={handleCreate}
              loading={creating}
              disabled={!selectedId}
              size="lg"
              className="w-full md:w-auto"
            >
              Create Invite with This Template
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
