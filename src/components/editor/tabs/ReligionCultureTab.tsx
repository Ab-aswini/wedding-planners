'use client'

import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { RELIGION_DEFAULTS } from '@/lib/constants'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

const RELIGION_OPTIONS = [
  { value: 'hindu', label: 'Hindu' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'christian', label: 'Christian' },
  { value: 'universal', label: 'Universal / Interfaith' },
]

const MOTIF_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'ganesha', label: 'Ganesha' },
  { value: 'bismillah', label: 'Bismillah' },
  { value: 'cross', label: 'Cross' },
  { value: 'khanda', label: 'Khanda' },
]

export default function ReligionCultureTab({ data, updateField }: Props) {
  function handleReligionChange(religion: string) {
    const r = religion as InviteData['religion']
    updateField('religion', r)

    // Apply religion defaults
    const defaults = RELIGION_DEFAULTS[r]
    if (defaults) {
      updateField('mantra', defaults.mantra)
      updateField('deityMotif', defaults.deityMotif as InviteData['deityMotif'])
      updateField('colors', defaults.colors)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <Select
        label="Religion / Culture"
        value={data.religion}
        onChange={(e) => handleReligionChange(e.target.value)}
        options={RELIGION_OPTIONS}
      />

      <Input
        label="Sacred Text / Mantra"
        value={data.mantra}
        onChange={(e) => updateField('mantra', e.target.value)}
        placeholder="Displayed at the top of the invite"
      />

      <Select
        label="Deity Motif"
        value={data.deityMotif}
        onChange={(e) => updateField('deityMotif', e.target.value as InviteData['deityMotif'])}
        options={MOTIF_OPTIONS}
      />

      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <p className="text-sm text-muted">
          Selecting a religion pre-fills the mantra, motif, and color scheme with culturally appropriate defaults. You can customize all of these afterwards.
        </p>
      </div>
    </div>
  )
}
