'use client'

import Input from '@/components/ui/Input'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

export default function CoupleDetailsTab({ data, updateField }: Props) {
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="text-lg font-semibold mb-4">Groom</h3>
        <div className="space-y-4">
          <Input
            label="Groom's Name"
            value={data.groomName}
            onChange={(e) => updateField('groomName', e.target.value)}
            placeholder="e.g. Rahul Sharma"
          />
          <Input
            label="Groom's Family"
            value={data.groomFamily}
            onChange={(e) => updateField('groomFamily', e.target.value)}
            placeholder="e.g. Son of Mr. & Mrs. Sharma"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Bride</h3>
        <div className="space-y-4">
          <Input
            label="Bride's Name"
            value={data.brideName}
            onChange={(e) => updateField('brideName', e.target.value)}
            placeholder="e.g. Priya Patel"
          />
          <Input
            label="Bride's Family"
            value={data.brideFamily}
            onChange={(e) => updateField('brideFamily', e.target.value)}
            placeholder="e.g. Daughter of Mr. & Mrs. Patel"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Wedding</h3>
        <div className="space-y-4">
          <Input
            label="Wedding Date"
            type="date"
            value={data.weddingDate}
            onChange={(e) => updateField('weddingDate', e.target.value)}
          />
          <Input
            label="Hashtag"
            value={data.hashtag}
            onChange={(e) => updateField('hashtag', e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            placeholder="e.g. RahulWedsPrivya"
            helperText="No spaces or special characters"
          />
        </div>
      </div>
    </div>
  )
}
