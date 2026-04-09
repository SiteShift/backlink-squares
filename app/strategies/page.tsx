import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'strategies'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building Strategies by Industry & Tactic')
}

export default function StrategiesHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
