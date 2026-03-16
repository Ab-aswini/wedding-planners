'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from '@/hooks/useOrganization'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
  const router = useRouter()
  const { org } = useOrganization()
  const [orgName, setOrgName] = useState(org?.name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!org) return
    setSaving(true)

    const supabase = createClient()
    await supabase
      .from('organizations')
      .update({ name: orgName })
      .eq('id', org.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Organization */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Organization</h2>
        <Input
          label="Business Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
          {saved && <span className="text-sm text-green-500">Saved!</span>}
        </div>
      </section>

      {/* Account */}
      <section className="space-y-4 border-t border-card-border pt-8">
        <h2 className="text-lg font-semibold">Account</h2>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </section>
    </div>
  )
}
