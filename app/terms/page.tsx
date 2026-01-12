import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for SEO Backlinks Grid. Read our terms and conditions before making a purchase.',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
}

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-500 mb-12">Last updated: January 2025</p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to SEO Backlinks Grid ("we," "our," or "us"). By accessing
              or using our website at backlinkgrid.com (the "Site") and purchasing
              our services, you agree to be bound by these Terms of Service ("Terms").
            </p>

            <h2>2. Service Description</h2>
            <p>
              SEO Backlinks Grid provides a visual grid where users can purchase
              "squares" that display their website logo/favicon and include a
              permanent dofollow backlink to their website. Each square purchase
              is a one-time payment for permanent placement.
            </p>

            <h2>3. Purchases and Payments</h2>
            <h3>3.1 Pricing</h3>
            <p>
              Square prices are displayed on our website and may change at any
              time. The price at the time of purchase is the price you pay. All
              prices are in British Pounds (GBP).
            </p>

            <h3>3.2 Payment Processing</h3>
            <p>
              All payments are processed securely through Stripe. By making a
              purchase, you agree to Stripe's terms of service. We do not store
              your payment card details.
            </p>

            <h3>3.3 Refund Policy</h3>
            <p>
              Due to the nature of our service (instant, permanent backlinks),
              we generally do not offer refunds once a square is live. However,
              if you experience technical issues preventing your square from
              displaying correctly, please contact us and we will work to resolve
              the issue or provide a refund at our discretion.
            </p>

            <h2>4. Acceptable Use</h2>
            <p>By purchasing a square, you agree that your linked website:</p>
            <ul>
              <li>Does not contain illegal content</li>
              <li>Does not promote violence, hate, or discrimination</li>
              <li>Does not contain malware, viruses, or malicious code</li>
              <li>Does not infringe on intellectual property rights</li>
              <li>Does not contain adult/explicit content without clear labeling</li>
              <li>Does not engage in spam, phishing, or deceptive practices</li>
              <li>Complies with all applicable laws and regulations</li>
            </ul>

            <h2>5. Content Rights</h2>
            <h3>5.1 Your Content</h3>
            <p>
              You retain ownership of any logos, images, or content you upload
              to our Site. By uploading content, you grant us a non-exclusive,
              worldwide license to display that content on our grid.
            </p>

            <h3>5.2 Removal Rights</h3>
            <p>
              We reserve the right to remove any square that violates these Terms
              or that we determine, in our sole discretion, is harmful to our
              platform or community. No refunds will be provided for squares
              removed due to Terms violations.
            </p>

            <h2>6. Link Characteristics</h2>
            <p>All links on our grid are:</p>
            <ul>
              <li>Dofollow (no rel="nofollow" attribute)</li>
              <li>
                Permanent (remain active as long as our website operates)
              </li>
              <li>Clickable and crawlable by search engines</li>
            </ul>
            <p>
              We make no guarantees about specific SEO results, rankings, or
              domain authority impacts. Link value depends on many factors
              outside our control.
            </p>

            <h2>7. Modifications to Service</h2>
            <p>
              We may modify, suspend, or discontinue any aspect of our service
              at any time. We will make reasonable efforts to notify users of
              significant changes. In the event of service discontinuation, we
              will attempt to maintain existing squares for as long as reasonably
              possible.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SEO Backlinks Grid shall
              not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of or inability to use
              our service.
            </p>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SEO Backlinks Grid and
              its owners, operators, and affiliates from any claims, damages,
              losses, or expenses arising from your use of our service or
              violation of these Terms.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of England and Wales. Any disputes shall be resolved in
              the courts of England and Wales.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify users
              of material changes by posting the new Terms on our Site. Your
              continued use of our service after changes constitutes acceptance
              of the updated Terms.
            </p>

            <h2>12. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@backlinkgrid.com">legal@backlinkgrid.com</a>.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
