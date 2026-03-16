'use client'

import { useRef, useState } from 'react'

interface FileUploadProps {
  label?: string
  accept?: string
  onUpload: (url: string) => void
  inviteId: string
  bucket?: string
  currentUrl?: string
}

export default function FileUpload({
  label,
  accept = 'image/*',
  onUpload,
  inviteId,
  bucket = 'invite-photos',
  currentUrl,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('inviteId', inviteId)
    formData.append('bucket', bucket)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { url } = await res.json()
      onUpload(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-card-border rounded-lg p-4 text-center cursor-pointer hover:border-accent transition-colors"
      >
        {currentUrl ? (
          <div className="relative">
            <img src={currentUrl} alt="Uploaded" className="max-h-32 mx-auto rounded-lg object-cover" />
            <p className="text-xs text-muted mt-2">Click to replace</p>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 mx-auto text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-muted">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
