import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature || !verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  const supabase = await createServiceClient()

  switch (event.event) {
    case 'subscription.activated':
    case 'subscription.charged': {
      const subId = event.payload.subscription?.entity?.id
      if (!subId) break

      // Find org by razorpay subscription id and update plan
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('razorpay_sub', subId)
        .single()

      if (org) {
        const planId = event.payload.subscription?.entity?.plan_id
        // Map Razorpay plan ID to our plan names (configure these in your Razorpay dashboard)
        let plan = 'starter'
        let inviteLimit = 5

        if (planId?.includes('pro')) {
          plan = 'pro'
          inviteLimit = 999
        }

        await supabase
          .from('organizations')
          .update({
            plan,
            invite_limit: inviteLimit,
            plan_expires: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
          .eq('id', org.id)
      }
      break
    }

    case 'subscription.cancelled':
    case 'subscription.expired': {
      const subId = event.payload.subscription?.entity?.id
      if (!subId) break

      await supabase
        .from('organizations')
        .update({
          plan: 'free',
          invite_limit: 1,
          plan_expires: null,
        })
        .eq('razorpay_sub', subId)
      break
    }
  }

  return NextResponse.json({ ok: true })
}
