import type { InviteData } from './types'

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

export function getMockInviteData(templateSlug = 'city'): InviteData {
  const weddingDate = new Date()
  weddingDate.setDate(weddingDate.getDate() + 45)
  const dateStr = weddingDate.toISOString().split('T')[0]

  const mehndiDate = new Date(weddingDate)
  mehndiDate.setDate(mehndiDate.getDate() - 2)
  const sangeetDate = new Date(weddingDate)
  sangeetDate.setDate(sangeetDate.getDate() - 1)
  const receptionDate = new Date(weddingDate)
  receptionDate.setDate(receptionDate.getDate() + 1)

  return {
    id: 'preview-mock',
    slug: 'rahul-and-priya-preview',
    status: 'published',
    templateId: templateSlug,
    groomName: 'Rahul Sharma',
    brideName: 'Priya Patel',
    groomFamily: 'Son of Mr. Vikram Sharma & Mrs. Sunita Sharma',
    brideFamily: 'Daughter of Mr. Rajesh Patel & Mrs. Meena Patel',
    weddingDate: dateStr,
    hashtag: '#RahulWedsPrivya',
    religion: 'hindu',
    mantra: 'ॐ गणेशाय नमः',
    deityMotif: 'ganesha',
    story: {
      how: 'We first met at a college cultural fest in Mumbai. Rahul was performing on stage and Priya was in the audience. A chance meeting at the chai stall afterwards turned into a three-hour conversation that neither of us wanted to end.',
      proposal: 'On a misty morning in Munnar, surrounded by tea gardens and the scent of cardamom in the air, Rahul got down on one knee. Priya said yes before he could even finish the question!',
      motto: 'Two souls, one journey — forever and always.',
    },
    events: [
      {
        id: 'evt-1',
        name: 'Mehndi Ceremony',
        date: mehndiDate.toISOString().split('T')[0],
        timeText: '4:00 PM onwards',
        venueName: 'Sharma Residence',
        venueCity: 'Udaipur, Rajasthan',
        mapLink: '',
        accentColor: '#E8A87C',
        sortOrder: 0,
        isPrivate: false,
        guestGroup: 'all',
      },
      {
        id: 'evt-2',
        name: 'Sangeet Night',
        date: sangeetDate.toISOString().split('T')[0],
        timeText: '7:00 PM — Late Night',
        venueName: 'The Leela Palace Lawns',
        venueCity: 'Udaipur, Rajasthan',
        mapLink: '',
        accentColor: '#D4AF37',
        sortOrder: 1,
        isPrivate: false,
        guestGroup: 'all',
      },
      {
        id: 'evt-3',
        name: 'Wedding Ceremony',
        date: dateStr,
        timeText: '10:30 AM — Muhurat Time',
        venueName: 'Jagmandir Island Palace',
        venueCity: 'Udaipur, Rajasthan',
        mapLink: '',
        accentColor: '#B8860B',
        sortOrder: 2,
        isPrivate: false,
        guestGroup: 'all',
      },
      {
        id: 'evt-4',
        name: 'Grand Reception',
        date: receptionDate.toISOString().split('T')[0],
        timeText: '7:00 PM onwards',
        venueName: 'Taj Lake Palace Ballroom',
        venueCity: 'Udaipur, Rajasthan',
        mapLink: '',
        accentColor: '#C5B358',
        sortOrder: 3,
        isPrivate: false,
        guestGroup: 'all',
      },
    ],
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
    dressCode: 'Traditional Indian attire preferred. Ladies in sarees or lehengas, Gentlemen in kurta-pajama or sherwani.',
    parkingInfo: 'Complimentary valet parking available at all venues. Shuttle service from Hotel Udaivilas every 30 minutes.',
    accommodation: 'Room blocks reserved at Hotel Udaivilas and The Oberoi Udaivilas. Use code RAHULPRIYA for special rates.',
    additionalInfo: {},
    showRsvp: true,
    showCountdown: true,
    showGallery: true,
    showStory: true,
    showMusic: true,
    viewCount: 342,
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
