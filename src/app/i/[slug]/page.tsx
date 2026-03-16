import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import InviteClientPage from './InviteClientPage'
import type { InviteData, EventData } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getInviteBySlug(slug: string) {
  const supabase = await createServiceClient()

  const { data: invite, error } = await supabase
    .from('invites')
    .select(`
      *,
      events (*),
      templates!inner (slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !invite) return null

  // Increment view count (fire and forget)
  supabase
    .from('invites')
    .update({ view_count: (invite.view_count || 0) + 1 })
    .eq('id', invite.id)
    .then(() => {})

  return invite
}

function mapToInviteData(raw: Record<string, unknown>): { data: InviteData; templateSlug: string } {
  const events = (raw.events as Record<string, unknown>[]) || []
  const template = raw.templates as Record<string, unknown>

  const inviteData: InviteData = {
    id: raw.id as string,
    slug: raw.slug as string,
    status: raw.status as InviteData['status'],
    templateId: raw.template_id as string,
    groomName: (raw.groom_name as string) || '',
    brideName: (raw.bride_name as string) || '',
    groomFamily: (raw.groom_family as string) || '',
    brideFamily: (raw.bride_family as string) || '',
    weddingDate: (raw.wedding_date as string) || '',
    hashtag: (raw.hashtag as string) || '',
    religion: (raw.religion as InviteData['religion']) || 'universal',
    mantra: (raw.mantra as string) || '',
    deityMotif: (raw.deity_motif as InviteData['deityMotif']) || 'none',
    story: {
      how: (raw.story_how as string) || '',
      proposal: (raw.story_proposal as string) || '',
      motto: (raw.story_motto as string) || '',
    },
    events: events.map((e): EventData => ({
      id: e.id as string,
      name: (e.name as string) || '',
      date: (e.date as string) || '',
      timeText: (e.time_text as string) || '',
      venueName: (e.venue_name as string) || '',
      venueCity: (e.venue_city as string) || '',
      mapLink: (e.map_link as string) || '',
      accentColor: (e.accent_color as string) || '',
      sortOrder: (e.sort_order as number) || 0,
      isPrivate: (e.is_private as boolean) || false,
      guestGroup: (e.guest_group as string) || 'all',
    })),
    photos: (raw.photos as string[]) || [],
    heroPhoto: (raw.hero_photo as string) || '',
    musicUrl: (raw.music_url as string) || '',
    colors: {
      primary: ((raw.color_overrides as Record<string, string>)?.primary) || '#1a1a2e',
      accent: ((raw.color_overrides as Record<string, string>)?.accent) || '#B8860B',
      background: ((raw.color_overrides as Record<string, string>)?.background) || '#0D0D1A',
      text: ((raw.color_overrides as Record<string, string>)?.text) || '#F5E6D0',
    },
    fonts: {
      heading: ((raw.font_overrides as Record<string, string>)?.heading) || 'Playfair Display',
      body: ((raw.font_overrides as Record<string, string>)?.body) || 'Cormorant Garamond',
    },
    dressCode: (raw.dress_code as string) || '',
    parkingInfo: (raw.parking_info as string) || '',
    accommodation: (raw.accommodation as string) || '',
    additionalInfo: (raw.additional_info as Record<string, string>) || {},
    showRsvp: raw.show_rsvp as boolean ?? true,
    showCountdown: raw.show_countdown as boolean ?? true,
    showGallery: raw.show_gallery as boolean ?? true,
    showStory: raw.show_story as boolean ?? true,
    showMusic: raw.show_music as boolean ?? true,
    viewCount: (raw.view_count as number) || 0,
  }

  return {
    data: inviteData,
    templateSlug: (template?.slug as string) || 'city',
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const invite = await getInviteBySlug(slug)

  if (!invite) {
    return { title: 'Invite Not Found' }
  }

  const groomName = invite.groom_name || 'Groom'
  const brideName = invite.bride_name || 'Bride'
  const title = `${groomName} & ${brideName} — Wedding Invitation`
  const description = invite.wedding_date
    ? `You're invited to the wedding of ${groomName} & ${brideName}. Save the date!`
    : `You're invited to the wedding of ${groomName} & ${brideName}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(invite.hero_photo ? { images: [{ url: invite.hero_photo, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(invite.hero_photo ? { images: [invite.hero_photo] } : {}),
    },
  }
}

export default async function InvitePage({ params }: PageProps) {
  const { slug } = await params
  const invite = await getInviteBySlug(slug)

  if (!invite) {
    notFound()
  }

  const { data, templateSlug } = mapToInviteData(invite as unknown as Record<string, unknown>)

  return <InviteClientPage data={data} templateSlug={templateSlug} />
}
