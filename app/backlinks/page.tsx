import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'backlinks'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Backlinks: The Complete Guide')
}

export default function BacklinksHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
