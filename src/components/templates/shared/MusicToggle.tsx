'use client'

import { useEffect, useRef, useState } from 'react'
import { InviteData } from '@/lib/types'

interface Props {
  data: InviteData
}

export default function MusicToggle({ data }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!data.musicUrl || !data.showMusic) return

    // Auto-play on first user interaction
    function handleInteraction() {
      if (audioRef.current && !playing) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
      }
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [data.musicUrl, data.showMusic, playing])

  if (!data.showMusic || !data.musicUrl) return null

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={data.musicUrl} loop preload="auto" />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 transition-transform hover:scale-110"
        style={{ backgroundColor: data.colors.accent, color: '#fff' }}
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  )
}
