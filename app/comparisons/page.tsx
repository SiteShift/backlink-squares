import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'comparisons'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building Tool & Service Comparisons')
}

export default function ComparisonsHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
