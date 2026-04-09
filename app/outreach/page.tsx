import { Metadata } from 'next'
import { HubRoutePage, generateHubPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'outreach'

export async function generateMetadata(): Promise<Metadata> {
  return generateHubPageMetadata(HUB_SLUG, 'Link Building Outreach: Prospecting, Personalization, and Follow-Up')
}

export default function OutreachHubPage() {
  return <HubRoutePage hubSlug={HUB_SLUG} />
}
