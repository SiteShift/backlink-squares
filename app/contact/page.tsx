import { Metadata } from 'next'
import { Mail, MessageSquare, Twitter, HelpCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description:
    'Have questions about SEO Backlinks Grid? Need help with your purchase? Get in touch with our team.',
  openGraph: {
    title: 'Contact SEO Backlinks Grid',
    description: 'Get in touch with our team for support and inquiries.',
  },
}

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Best for general inquiries and support',
    action: 'hello@backlinkgrid.com',
    href: 'mailto:hello@backlinkgrid.com',
    cta: 'Send Email',
    color: 'red',
  },
  {
    icon: Twitter,
    title: 'Twitter/X',
    description: 'Follow us for updates and quick questions',
    action: '@seobacklinks',
    href: 'https://twitter.com/seobacklinks',
    cta: 'Follow Us',
    color: 'blue',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Find instant answers to common questions',
    action: 'View FAQ',
    href: '/#faq',
    cta: 'Browse FAQ',
    color: 'yellow',
  },
]

const colorClasses = {
  red: 'bg-bauhaus-red',
  blue: 'bg-bauhaus-blue',
  yellow: 'bg-bauhaus-yellow',
}

const commonTopics = [
  {
    title: 'Purchase Support',
    description: 'Issues with payment, square placement, or logo uploads',
  },
  {
    title: 'Update Request',
    description: 'Need to change your URL, logo, or site name',
  },
  {
    title: 'Partnership Inquiries',
    description: 'Interested in featuring or promoting our grid',
  },
  {
    title: 'Technical Issues',
    description: 'Bug reports or website functionality problems',
  },
]

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-white border-b-3 border-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-wide text-dark">
              Get in Touch
            </h1>
            <p className="mt-6 text-xl text-dark/60 max-w-2xl mx-auto">
              Have a question or need help? We're here for you. Reach out through
              any of the channels below.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group block bg-white border-3 border-dark p-8 hover:shadow-bauhaus transition-all"
                >
                  <div className={`w-14 h-14 ${colorClasses[method.color as keyof typeof colorClasses]} border-3 border-dark flex items-center justify-center mb-4`}>
                    <method.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wide text-dark mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-dark/60 mb-4">
                    {method.description}
                  </p>
                  <span className="font-bold text-bauhaus-red group-hover:underline">
                    {method.action}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-white border-y-3 border-dark">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-14 h-14 bg-bauhaus-blue border-3 border-dark flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-wide text-dark">
                Send Us a Message
              </h2>
              <p className="mt-2 text-dark/60">
                We typically respond within 24 hours
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold uppercase tracking-wider text-dark mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-3 border-dark bg-white focus:outline-none focus:shadow-bauhaus-blue transition-all"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold uppercase tracking-wider text-dark mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-3 border-dark bg-white focus:outline-none focus:shadow-bauhaus-blue transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-bold uppercase tracking-wider text-dark mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border-3 border-dark bg-white focus:outline-none focus:shadow-bauhaus-blue transition-all"
                >
                  <option value="">Select a topic</option>
                  <option value="purchase">Purchase Support</option>
                  <option value="update">Update My Square</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-bold uppercase tracking-wider text-dark mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border-3 border-dark bg-white focus:outline-none focus:shadow-bauhaus-blue transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-bauhaus-red"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Common Topics */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bold text-2xl uppercase tracking-wide text-dark text-center mb-12">
              Common Topics
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {commonTopics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-white border-3 border-dark p-6"
                >
                  <h3 className="font-bold uppercase tracking-wide text-dark mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-dark/60">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
