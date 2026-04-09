import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'link-building-tactics'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building Tactics: Proven Methods for Earning Links')
}

export default function TacticsHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
