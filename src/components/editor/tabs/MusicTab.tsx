'use client'

import Input from '@/components/ui/Input'
import FileUpload from '@/components/ui/FileUpload'
import type { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
}

export default function MusicTab({ data, updateField }: Props) {
  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Background Music</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.showMusic}
            onChange={(e) => updateField('showMusic', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Enable music</span>
        </label>
      </div>

      <p className="text-sm text-muted">
        Upload an audio file that plays in the background when guests view the invite.
        Music auto-plays after the first interaction.
      </p>

      <FileUpload
        label="Upload Audio File"
        accept="audio/*"
        inviteId={data.id}
        bucket="invite-music"
        onUpload={(url) => updateField('musicUrl', url)}
        currentUrl={data.musicUrl ? undefined : undefined}
      />

      <div className="text-center text-sm text-muted">or</div>

      <Input
        label="Music URL"
        value={data.musicUrl}
        onChange={(e) => updateField('musicUrl', e.target.value)}
        placeholder="https://example.com/song.mp3"
        helperText="Direct link to an MP3 file"
      />

      {data.musicUrl && (
        <div className="bg-card-bg border border-card-border rounded-lg p-4">
          <p className="text-xs text-muted mb-2">Preview</p>
          <audio controls src={data.musicUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  )
}
