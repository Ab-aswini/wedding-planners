import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { InviteData } from '@/lib/types'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()

  const { data: invite, error } = await supabase
    .from('invites')
    .select('*, events(*), templates!inner(slug)')
    .eq('id', id)
    .single()

  if (error || !invite) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
  }

  // Map to InviteData shape for the editor
  const events = invite.events || []
  const colorOverrides = (invite.color_overrides as Record<string, string>) || {}
  const fontOverrides = (invite.font_overrides as Record<string, string>) || {}

  const mapped: InviteData = {
    id: invite.id,
    slug: invite.slug,
    status: invite.status,
    templateId: invite.template_id,
    groomName: invite.groom_name || '',
    brideName: invite.bride_name || '',
    groomFamily: invite.groom_family || '',
    brideFamily: invite.bride_family || '',
    weddingDate: invite.wedding_date || '',
    hashtag: invite.hashtag || '',
    religion: invite.religion || 'universal',
    mantra: invite.mantra || '',
    deityMotif: invite.deity_motif || 'none',
    story: {
      how: invite.story_how || '',
      proposal: invite.story_proposal || '',
      motto: invite.story_motto || '',
    },
    events: events.map((e: Record<string, unknown>) => ({
      id: e.id,
      name: e.name || '',
      date: e.date || '',
      timeText: e.time_text || '',
      venueName: e.venue_name || '',
      venueCity: e.venue_city || '',
      mapLink: e.map_link || '',
      accentColor: e.accent_color || '',
      sortOrder: e.sort_order || 0,
      isPrivate: e.is_private || false,
      guestGroup: e.guest_group || 'all',
    })),
    photos: (invite.photos as string[]) || [],
    heroPhoto: invite.hero_photo || '',
    musicUrl: invite.music_url || '',
    colors: {
      primary: colorOverrides.primary || '#1a1a2e',
      accent: colorOverrides.accent || '#B8860B',
      background: colorOverrides.background || '#0D0D1A',
      text: colorOverrides.text || '#F5E6D0',
    },
    fonts: {
      heading: fontOverrides.heading || 'Playfair Display',
      body: fontOverrides.body || 'Cormorant Garamond',
    },
    dressCode: invite.dress_code || '',
    parkingInfo: invite.parking_info || '',
    accommodation: invite.accommodation || '',
    additionalInfo: (invite.additional_info as Record<string, string>) || {},
    showRsvp: invite.show_rsvp ?? true,
    showCountdown: invite.show_countdown ?? true,
    showGallery: invite.show_gallery ?? true,
    showStory: invite.show_story ?? true,
    showMusic: invite.show_music ?? true,
    viewCount: invite.view_count || 0,
  }

  return NextResponse.json(mapped)
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const body: InviteData = await request.json()

  // Update invite fields
  const { error: inviteError } = await supabase
    .from('invites')
    .update({
      groom_name: body.groomName,
      bride_name: body.brideName,
      groom_family: body.groomFamily,
      bride_family: body.brideFamily,
      wedding_date: body.weddingDate || null,
      hashtag: body.hashtag,
      religion: body.religion,
      mantra: body.mantra,
      deity_motif: body.deityMotif,
      story_how: body.story?.how,
      story_proposal: body.story?.proposal,
      story_motto: body.story?.motto,
      photos: body.photos,
      hero_photo: body.heroPhoto,
      music_url: body.musicUrl,
      color_overrides: body.colors,
      font_overrides: body.fonts,
      dress_code: body.dressCode,
      parking_info: body.parkingInfo,
      accommodation: body.accommodation,
      additional_info: body.additionalInfo,
      show_rsvp: body.showRsvp,
      show_countdown: body.showCountdown,
      show_gallery: body.showGallery,
      show_story: body.showStory,
      show_music: body.showMusic,
    })
    .eq('id', id)

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 })
  }

  // Sync events: delete existing, insert new
  if (body.events) {
    await supabase.from('events').delete().eq('invite_id', id)

    if (body.events.length > 0) {
      const eventRows = body.events.map((e) => ({
        id: e.id,
        invite_id: id,
        name: e.name,
        date: e.date || null,
        time_text: e.timeText,
        venue_name: e.venueName,
        venue_city: e.venueCity,
        map_link: e.mapLink,
        accent_color: e.accentColor,
        sort_order: e.sortOrder,
        is_private: e.isPrivate,
        guest_group: e.guestGroup,
      }))

      await supabase.from('events').insert(eventRows)
    }
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()

  const { error } = await supabase.from('invites').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
