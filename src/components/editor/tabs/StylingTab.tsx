'use client'

import ColorPicker from '@/components/ui/ColorPicker'
import Select from '@/components/ui/Select'
import { FONT_PAIRS } from '@/lib/constants'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

const FONT_OPTIONS = FONT_PAIRS.map((pair) => ({
  value: pair.heading,
  label: `${pair.label} (${pair.heading} + ${pair.body})`,
}))

export default function StylingTab({ data, updateField, updateNested }: Props) {
  function handleFontChange(headingFont: string) {
    const pair = FONT_PAIRS.find((p) => p.heading === headingFont)
    if (pair) {
      updateField('fonts', { heading: pair.heading, body: pair.body })
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Colors</h3>
        <div className="space-y-4">
          <ColorPicker
            label="Primary Color"
            value={data.colors.primary}
            onChange={(color) => updateNested('colors', 'primary', color)}
          />
          <ColorPicker
            label="Accent Color"
            value={data.colors.accent}
            onChange={(color) => updateNested('colors', 'accent', color)}
          />
          <ColorPicker
            label="Background Color"
            value={data.colors.background}
            onChange={(color) => updateNested('colors', 'background', color)}
          />
          <ColorPicker
            label="Text Color"
            value={data.colors.text}
            onChange={(color) => updateNested('colors', 'text', color)}
          />
        </div>
      </div>

      {/* Live preview swatch */}
      <div
        className="rounded-lg p-6 text-center border"
        style={{
          backgroundColor: data.colors.background,
          color: data.colors.text,
          borderColor: data.colors.accent + '40',
        }}
      >
        <p className="text-xs opacity-50 mb-2" style={{ color: data.colors.accent }}>Preview</p>
        <p className="text-xl" style={{ fontFamily: data.fonts.heading, color: data.colors.text }}>
          {data.groomName || 'Groom'} & {data.brideName || 'Bride'}
        </p>
        <p className="text-sm mt-1 opacity-60" style={{ fontFamily: data.fonts.body }}>
          Your wedding invitation
        </p>
      </div>

      {/* Fonts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fonts</h3>
        <Select
          label="Font Pair"
          value={data.fonts.heading}
          onChange={(e) => handleFontChange(e.target.value)}
          options={FONT_OPTIONS}
        />
        <p className="text-xs text-muted mt-2">
          Current: <strong>{data.fonts.heading}</strong> (headings) + <strong>{data.fonts.body}</strong> (body)
        </p>
      </div>
    </div>
  )
}
