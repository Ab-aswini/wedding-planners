import { type InviteData } from './types'

export function generateSlug(groomName: string, brideName: string): string {
  const base = `${groomName}-and-${brideName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const suffix = Math.random().toString(36).substring(2, 8)
  return `${base}-${suffix}`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return 0
  const target = new Date(dateStr)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function getDefaultInviteData(): Partial<InviteData> {
  return {
    status: 'draft',
    groomName: '',
    brideName: '',
    groomFamily: '',
    brideFamily: '',
    weddingDate: '',
    hashtag: '',
    religion: 'universal',
    mantra: '',
    deityMotif: 'none',
    story: { how: '', proposal: '', motto: '' },
    events: [],
    photos: [],
    heroPhoto: '',
    musicUrl: '',
    colors: {
      primary: '#1a1a2e',
      accent: '#B8860B',
      background: '#0D0D1A',
      text: '#F5E6D0',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Cormorant Garamond',
    },
    dressCode: '',
    parkingInfo: '',
    accommodation: '',
    additionalInfo: {},
    showRsvp: true,
    showCountdown: true,
    showGallery: true,
    showStory: true,
    showMusic: true,
    viewCount: 0,
  }
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function transformKeys<T>(
  obj: Record<string, unknown>,
  transformer: (key: string) => string
): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[transformer(key)] = value
  }
  return result as T
}
