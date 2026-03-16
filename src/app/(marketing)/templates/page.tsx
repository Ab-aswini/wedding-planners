import Link from 'next/link'

const TEMPLATE_PREVIEWS = [
  { slug: 'city', name: 'City Lights', category: 'Hindu', description: 'Dark & gold. Elegant, urban. Perfect for modern Hindu weddings.' },
  { slug: 'beach', name: 'Beach Breeze', category: 'Universal', description: 'Light, airy, coastal vibes. Great for destination weddings.' },
  { slug: 'meenaya', name: 'Meenaya', category: 'South Indian', description: 'Rich, traditional. Designed for South Indian ceremonies.' },
]

export default function TemplatesPage() {
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

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-center">
          Template Gallery
        </h1>
        <p className="mt-4 text-muted text-center max-w-xl mx-auto">
          Culturally authentic designs for Hindu, Muslim, Sikh, Christian, and South Indian weddings.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {TEMPLATE_PREVIEWS.map((t) => (
            <div key={t.slug} className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:border-accent/40 transition-colors">
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-6xl opacity-20">🎨</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="text-sm text-accent mt-0.5">{t.category}</p>
                <p className="text-sm text-muted mt-2">{t.description}</p>
                <Link
                  href="/signup"
                  className="inline-block mt-4 text-sm text-accent hover:underline"
                >
                  Use this template &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
