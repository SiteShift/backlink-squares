import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'digital-pr'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Digital PR for Links: Media Coverage and Authority')
}

export default function DigitalPRHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
