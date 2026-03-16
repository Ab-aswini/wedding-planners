'use client'

import { useState } from 'react'
import EditorTabs, { type TabId } from './EditorTabs'
import PreviewIframe from './PreviewIframe'
import CoupleDetailsTab from './tabs/CoupleDetailsTab'
import ReligionCultureTab from './tabs/ReligionCultureTab'
import EventsTab from './tabs/EventsTab'
import GalleryTab from './tabs/GalleryTab'
import StoryTab from './tabs/StoryTab'
import MusicTab from './tabs/MusicTab'
import GuestInfoTab from './tabs/GuestInfoTab'
import StylingTab from './tabs/StylingTab'
import PublishTab from './tabs/PublishTab'
import type { InviteData } from '@/lib/types'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  data: InviteData
  templateSlug: string
  saveStatus: SaveStatus
  updateField: <K extends keyof InviteData>(field: K, value: InviteData[K]) => void
  updateNested: <K extends keyof InviteData>(field: K, subField: string, value: unknown) => void
  saveNow: () => void
}

export default function EditorLayout({ data, templateSlug, saveStatus, updateField, updateNested, saveNow }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('couple')
  const [showPreview, setShowPreview] = useState(false)

  const tabProps = { data, updateField, updateNested }

  function renderTab() {
    switch (activeTab) {
      case 'couple': return <CoupleDetailsTab {...tabProps} />
      case 'religion': return <ReligionCultureTab {...tabProps} />
      case 'events': return <EventsTab {...tabProps} />
      case 'gallery': return <GalleryTab {...tabProps} />
      case 'story': return <StoryTab {...tabProps} />
      case 'music': return <MusicTab {...tabProps} />
      case 'guestinfo': return <GuestInfoTab {...tabProps} />
      case 'styling': return <StylingTab {...tabProps} />
      case 'publish': return <PublishTab data={data} saveNow={saveNow} />
      default: return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Editor header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-card-border bg-card-bg">
        <div className="flex items-center gap-3">
          <a href="/dashboard/invites" className="text-muted hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-sm font-medium truncate max-w-[200px]">
            {data.groomName && data.brideName
              ? `${data.groomName} & ${data.brideName}`
              : 'Untitled Invite'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Save status indicator */}
          <span className={`text-xs ${
            saveStatus === 'saving' ? 'text-yellow-500 saving-indicator' :
            saveStatus === 'saved' ? 'text-green-500' :
            saveStatus === 'error' ? 'text-red-500' :
            'text-muted'
          }`}>
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved'}
            {saveStatus === 'error' && 'Save failed'}
          </span>
          {/* Mobile preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden text-sm px-3 py-1.5 rounded-lg border border-card-border text-muted hover:text-foreground"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <div className={`w-full md:w-1/2 lg:w-[55%] flex flex-col border-r border-card-border ${showPreview ? 'hidden md:flex' : 'flex'}`}>
          <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-y-auto p-6">
            {renderTab()}
          </div>
        </div>

        {/* Right: Preview */}
        <div className={`w-full md:w-1/2 lg:w-[45%] ${showPreview ? 'block' : 'hidden md:block'}`}>
          <PreviewIframe data={data} templateSlug={templateSlug} />
        </div>
      </div>
    </div>
  )
}
