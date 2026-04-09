import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'link-building'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building: The Complete Strategy Guide')
}

export default function LinkBuildingHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
