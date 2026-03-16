import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-accent">
          InviteForge
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-light transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-heading)] leading-tight">
          Beautiful Wedding Invites,{' '}
          <span className="text-accent">Built in Minutes</span>
        </h2>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Create stunning, shareable wedding invitation websites for your clients.
          Pick a template, fill the details, publish — share on WhatsApp instantly.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-accent text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-accent-light transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/templates"
            className="border border-card-border px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View Templates
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Template Library',
              desc: 'Hindu, Muslim, Sikh, Christian, South Indian — culturally authentic designs for every wedding.',
              icon: '🎨',
            },
            {
              title: 'WhatsApp Ready',
              desc: 'Every invite generates a beautiful link preview card. Your clients\' guests see the couple photo + date instantly.',
              icon: '📱',
            },
            {
              title: 'RSVP Tracking',
              desc: 'Guests RSVP directly on the invite. You see every response in your dashboard — name, count, message.',
              icon: '📋',
            },
          ].map((f) => (
            <div key={f.title} className="bg-card-bg border border-card-border rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="text-3xl font-bold font-[family-name:var(--font-heading)]">
          Ready to impress your clients?
        </h3>
        <p className="mt-4 text-muted">
          Free plan includes 1 invite. No credit card required.
        </p>
        <Link
          href="/signup"
          className="inline-block mt-6 bg-accent text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-accent-light transition-colors"
        >
          Create Your First Invite
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} InviteForge. Built for Indian wedding planners.</p>
      </footer>
    </div>
  )
}
