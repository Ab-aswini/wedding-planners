'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useDebounce } from './useDebounce'
import type { InviteData } from '@/lib/types'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useInvite(inviteId: string) {
  const [data, setData] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  // Fetch invite data
  useEffect(() => {
    isMounted.current = true

    async function fetchInvite() {
      try {
        const res = await fetch(`/api/invites/${inviteId}`)
        if (!res.ok) throw new Error('Failed to fetch invite')
        const json = await res.json()
        if (isMounted.current) {
          setData(json)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : 'Failed to load invite')
          setLoading(false)
        }
      }
    }

    fetchInvite()
    return () => { isMounted.current = false }
  }, [inviteId])

  // Save function
  const saveToServer = useCallback(
    async (updatedData: InviteData) => {
      setSaveStatus('saving')
      try {
        const res = await fetch(`/api/invites/${inviteId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        })

        if (!res.ok) throw new Error('Save failed')

        if (isMounted.current) {
          setSaveStatus('saved')
          // Reset to idle after 2 seconds
          setTimeout(() => {
            if (isMounted.current) setSaveStatus('idle')
          }, 2000)
        }
      } catch {
        if (isMounted.current) setSaveStatus('error')
      }
    },
    [inviteId]
  )

  // Debounced save (1.5s delay)
  const debouncedSave = useDebounce(saveToServer, 1500)

  // Update a field and trigger auto-save
  const updateField = useCallback(
    <K extends keyof InviteData>(field: K, value: InviteData[K]) => {
      setData((prev) => {
        if (!prev) return prev
        const updated = { ...prev, [field]: value }
        debouncedSave(updated)
        return updated
      })
    },
    [debouncedSave]
  )

  // Update nested fields (e.g., colors.primary, story.how)
  const updateNested = useCallback(
    <K extends keyof InviteData>(
      field: K,
      subField: string,
      value: unknown
    ) => {
      setData((prev) => {
        if (!prev) return prev
        const current = prev[field]
        if (typeof current !== 'object' || current === null) return prev
        const updated = {
          ...prev,
          [field]: { ...(current as Record<string, unknown>), [subField]: value },
        }
        debouncedSave(updated as InviteData)
        return updated as InviteData
      })
    },
    [debouncedSave]
  )

  // Force immediate save
  const saveNow = useCallback(() => {
    if (data) saveToServer(data)
  }, [data, saveToServer])

  return {
    data,
    setData,
    loading,
    error,
    saveStatus,
    updateField,
    updateNested,
    saveNow,
  }
}
