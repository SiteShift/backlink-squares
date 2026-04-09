import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'statistics'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building & SEO Statistics')
}

export default function StatisticsHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
