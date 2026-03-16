'use client'

import { useOrganization } from '@/hooks/useOrganization'
import { PLAN_LIMITS } from '@/lib/constants'
import Button from '@/components/ui/Button'

const PLANS = [
  {
    name: 'Free',
    key: 'free' as const,
    price: '₹0',
    period: 'forever',
    features: ['1 invite', 'Basic templates', 'RSVP collection', 'WhatsApp sharing'],
  },
  {
    name: 'Starter',
    key: 'starter' as const,
    price: '₹499',
    period: '/month',
    features: ['5 invites', 'Premium templates', 'Analytics dashboard', 'Priority support'],
  },
  {
    name: 'Pro',
    key: 'pro' as const,
    price: '₹1,499',
    period: '/month',
    features: ['Unlimited invites', 'All templates', 'Custom domain', 'Analytics + export', 'White-label branding'],
  },
]

export default function BillingPage() {
  const { org } = useOrganization()
  const currentPlan = org?.plan || 'free'

  async function handleUpgrade(planKey: string) {
    // TODO: Integrate Razorpay checkout
    alert(`Razorpay checkout for ${planKey} plan — integration pending. Connect your Razorpay keys in .env.local to enable.`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted mt-1">
          Current plan: <span className="font-medium text-accent capitalize">{currentPlan}</span>
          {' '}&bull;{' '}
          {PLAN_LIMITS[currentPlan].invites === 999 ? 'Unlimited' : PLAN_LIMITS[currentPlan].invites} invite{PLAN_LIMITS[currentPlan].invites !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.key
          return (
            <div
              key={plan.key}
              className={`bg-card-bg border rounded-xl p-6 ${
                isCurrent ? 'border-accent ring-2 ring-accent/20' : 'border-card-border'
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {isCurrent ? (
                  <Button variant="outline" disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button
                    variant={plan.key === 'pro' ? 'primary' : 'secondary'}
                    onClick={() => handleUpgrade(plan.key)}
                    className="w-full"
                  >
                    {plan.key === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
