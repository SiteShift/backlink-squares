import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'backlink-quality'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Backlink Quality: Evaluate Links and Avoid Risks')
}

export default function BacklinkQualityHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
