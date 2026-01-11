import Link from 'next/link'
import { Twitter, Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  product: [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/#grid', label: 'Buy a Square' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/statistics', label: 'Statistics' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/guides', label: 'Guides' },
    { href: '/glossary', label: 'Glossary' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ],
}

const socialLinks = [
  { href: 'https://twitter.com/seobacklinks', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com/company/seobacklinks', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com/seobacklinks', icon: Github, label: 'GitHub' },
  { href: 'mailto:hello@seobacklinks.dev', icon: Mail, label: 'Email' },
]

export function Footer() {
  return (
    <footer className="bg-surface-100 border-t-2 border-surface-200">
      <div className="container-wide">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-5">
              <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                {/* Logo */}
                <div className="relative w-10 h-10 grid grid-cols-3 gap-[2px] p-[2px] bg-surface-950">
                  <div className="bg-brand-red" />
                  <div className="bg-brand-red" />
                  <div className="bg-white" />
                  <div className="bg-brand-red" />
                  <div className="bg-brand-yellow group-hover:bg-brand-blue transition-colors duration-300" />
                  <div className="bg-white" />
                  <div className="bg-white" />
                  <div className="bg-white" />
                  <div className="bg-brand-blue" />
                </div>
                <span className="font-display font-black text-lg tracking-tight">
                  BACKLINK<span className="text-brand-red">GRID</span>
                </span>
              </Link>

              <p className="text-sm text-surface-600 mb-6 max-w-sm leading-relaxed">
                The visual backlink marketplace. Own your square, get your permanent dofollow link.
                Simple, transparent, effective.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border-2 border-surface-300 bg-white flex items-center justify-center
                             hover:border-surface-950 hover:bg-brand-yellow transition-all duration-200"
                    aria-label={link.label}
                  >
                    <link.icon className="w-4 h-4 text-surface-600" strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 lg:col-span-2">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-950 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 lg:col-span-2">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-950 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 lg:col-span-2">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-950 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} SEO Backlinks Grid. All rights reserved.
          </p>

          {/* Color dots signature */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-400 hidden sm:block">Built with</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-brand-red" />
              <div className="w-3 h-3 bg-brand-yellow" />
              <div className="w-3 h-3 bg-brand-blue" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
