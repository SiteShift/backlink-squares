import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for SEO Backlinks Grid. Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-12">Last updated: January 2025</p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              SEO Backlinks Grid ("we," "our," or "us") respects your privacy
              and is committed to protecting your personal data. This Privacy
              Policy explains how we collect, use, and safeguard your information
              when you visit our website backlinkgrid.com and use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <p>When you purchase a square, we collect:</p>
            <ul>
              <li>Email address (for receipts and communication)</li>
              <li>Website URL (displayed on the grid)</li>
              <li>Site/business name (displayed on hover)</li>
              <li>Logo or favicon image (displayed in your square)</li>
            </ul>

            <h3>2.2 Payment Information</h3>
            <p>
              Payment processing is handled by Stripe. We do not store your
              credit card details on our servers. Stripe's privacy policy
              governs the handling of your payment information.
            </p>

            <h3>2.3 Automatically Collected Information</h3>
            <p>
              We automatically collect certain information when you visit our
              Site, including:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Pages visited and time spent</li>
              <li>Referral source</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Process your square purchase and display your content</li>
              <li>Send purchase confirmations and receipts</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Improve our website and services</li>
              <li>Analyze usage patterns and site performance</li>
              <li>Prevent fraud and maintain security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <h3>4.1 Public Information</h3>
            <p>
              The following information is publicly visible on our grid:
            </p>
            <ul>
              <li>Your website URL (as a dofollow link)</li>
              <li>Your site/business name</li>
              <li>Your uploaded logo or favicon</li>
            </ul>

            <h3>4.2 Third-Party Services</h3>
            <p>We share information with the following third parties:</p>
            <ul>
              <li>
                <strong>Stripe:</strong> For payment processing
              </li>
              <li>
                <strong>Supabase:</strong> For data storage and hosting
              </li>
              <li>
                <strong>Vercel:</strong> For website hosting
              </li>
              <li>
                <strong>Analytics providers:</strong> For website analytics
              </li>
            </ul>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order,
              or governmental authority, or if we believe disclosure is necessary
              to protect our rights, property, or safety.
            </p>

            <h2>5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve your experience,
              analyze site traffic, and understand user behavior. You can control
              cookies through your browser settings, though some features may
              not function properly without them.
            </p>

            <h3>Types of Cookies We Use:</h3>
            <ul>
              <li>
                <strong>Essential cookies:</strong> Required for basic site
                functionality
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us understand how
                visitors interact with our site
              </li>
              <li>
                <strong>Preference cookies:</strong> Remember your settings and
                preferences
              </li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission over
              the Internet is 100% secure.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to provide
              our services and fulfill the purposes outlined in this policy. For
              square purchases, we retain data indefinitely as the placement is
              permanent. You may request deletion of your data by contacting us.
            </p>

            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@backlinkgrid.com">
                privacy@backlinkgrid.com
              </a>.
            </p>

            <h2>9. International Transfers</h2>
            <p>
              Your data may be processed in countries outside your own. We ensure
              appropriate safeguards are in place for any international transfers
              of personal data.
            </p>

            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 16. We do not
              knowingly collect personal data from children. If you believe we
              have collected data from a child, please contact us immediately.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of significant changes by posting the new policy on our Site
              and updating the "Last updated" date.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <ul>
              <li>
                Email:{' '}
                <a href="mailto:privacy@backlinkgrid.com">
                  privacy@backlinkgrid.com
                </a>
              </li>
            </ul>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
