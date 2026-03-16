'use client'

import { InviteData } from '@/lib/types'
import CityTemplate from './city/CityTemplate'

interface Props {
  data: InviteData
  templateSlug: string
}

const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: InviteData }>> = {
  city: CityTemplate,
  // beach: BeachTemplate,    — Phase 2 templates
  // meenaya: MeenayaTemplate — Phase 2 templates
}

export default function TemplateRenderer({ data, templateSlug }: Props) {
  const Template = TEMPLATE_MAP[templateSlug] || CityTemplate
  return <Template data={data} />
}
