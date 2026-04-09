import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'resources'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building Resources: Templates, Checklists & Tools')
}

export default function ResourcesHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
