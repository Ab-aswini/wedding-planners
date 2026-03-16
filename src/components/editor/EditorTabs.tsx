'use client'

const TABS = [
  { id: 'couple', label: 'Couple Details', icon: '💑' },
  { id: 'religion', label: 'Religion & Culture', icon: '🙏' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'gallery', label: 'Gallery', icon: '📷' },
  { id: 'story', label: 'Our Story', icon: '💕' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'guestinfo', label: 'Guest Info', icon: '📋' },
  { id: 'styling', label: 'Styling', icon: '🎨' },
  { id: 'publish', label: 'Publish', icon: '🚀' },
] as const

export type TabId = (typeof TABS)[number]['id']

interface Props {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function EditorTabs({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex overflow-x-auto border-b border-card-border bg-card-bg">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <span>{tab.icon}</span>
          <span className="hidden md:inline">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export { TABS }
