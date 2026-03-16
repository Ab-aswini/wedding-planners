import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['1 wedding invite', 'Basic templates', 'RSVP collection', 'WhatsApp sharing', 'Mobile-optimized output'],
    cta: 'Get Started Free',
  },
  {
    name: 'Starter',
    price: '₹499',
    period: '/month',
    features: ['5 wedding invites', 'Premium templates', 'Analytics dashboard', 'Priority email support', 'Custom colors & fonts'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Pro',
    price: '₹1,499',
    period: '/month',
    features: ['Unlimited invites', 'All templates', 'Custom domain', 'Analytics + CSV export', 'White-label branding', 'Dedicated support'],
    cta: 'Start Free Trial',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-2xl font-bold font-[family-name:var(--font-heading)] text-accent">
          InviteForge
        </Link>
        <Link href="/signup" className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-light transition-colors">
          Get Started
        </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)]">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-muted max-w-xl mx-auto">
          Start free. Upgrade when you need more invites or premium features.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-card-bg border rounded-xl p-8 relative ${
                plan.popular ? 'border-accent ring-2 ring-accent/20' : 'border-card-border'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 block text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-accent text-white hover:bg-accent-light'
                    : 'border border-card-border hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
