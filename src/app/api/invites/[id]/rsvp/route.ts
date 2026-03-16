import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params
  // Use service client since RSVPs are public (no auth required)
  const supabase = await createServiceClient()
  const body = await request.json()

  const { guestName, attending, guestCount, message, phone, eventIds } = body

  if (!guestName) {
    return NextResponse.json({ error: 'Guest name is required' }, { status: 400 })
  }

  const { error } = await supabase.from('rsvps').insert({
    invite_id: id,
    guest_name: guestName,
    attending,
    guest_count: guestCount || 1,
    message: message || '',
    phone: phone || '',
    event_ids: eventIds || [],
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
