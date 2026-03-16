'use client'

interface StatCard {
  label: string
  value: string | number
  sub?: string
}

interface Props {
  stats: StatCard[]
}

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card-bg border border-card-border rounded-xl p-4">
          <p className="text-xs text-muted uppercase tracking-wider">{stat.label}</p>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
          {stat.sub && <p className="text-xs text-muted mt-1">{stat.sub}</p>}
        </div>
      ))}
    </div>
  )
}
