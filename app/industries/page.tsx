import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'industries'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building by Industry: Strategies for Every Vertical')
}

export default function IndustriesHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
