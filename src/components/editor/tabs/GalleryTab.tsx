'use client'

import FileUpload from '@/components/ui/FileUpload'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

export default function GalleryTab({ data, updateField }: Props) {
  function addPhoto(url: string) {
    updateField('photos', [...data.photos, url])
  }

  function removePhoto(index: number) {
    updateField('photos', data.photos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Hero Photo */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Hero Photo</h3>
        <p className="text-sm text-muted mb-3">
          This appears at the top of the invite and in WhatsApp link previews.
        </p>
        <FileUpload
          label="Upload Hero Photo"
          inviteId={data.id}
          onUpload={(url) => updateField('heroPhoto', url)}
          currentUrl={data.heroPhoto || undefined}
        />
      </div>

      {/* Gallery Photos */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Gallery Photos</h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted">Add photos to the gallery section.</p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.showGallery}
              onChange={(e) => updateField('showGallery', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show gallery</span>
          </label>
        </div>

        {/* Existing photos */}
        {data.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {data.photos.map((photo, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <FileUpload
          label="Add Photo"
          inviteId={data.id}
          onUpload={addPhoto}
        />
      </div>
    </div>
  )
}
