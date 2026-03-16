import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { publish } = await request.json()

  const updateData: Record<string, unknown> = {
    status: publish ? 'published' : 'draft',
  }

  if (publish) {
    updateData.published_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('invites')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status: publish ? 'published' : 'draft' })
}
