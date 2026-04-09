import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'backlink-audit'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Backlink Audit: Analyze, Fix, and Improve Your Link Profile')
}

export default function BacklinkAuditHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
