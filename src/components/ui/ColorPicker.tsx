'use client'

interface ColorPickerProps {
  label?: string
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      )}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-card-border cursor-pointer bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-card-border bg-transparent text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
