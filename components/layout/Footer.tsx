import Link from 'next/link'
import { Twitter, Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  product: [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/#grid', label: 'Buy a Square' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/bundle', label: 'Bundle Deal' },
  ],
  learn: [
    { href: '/backlinks', label: 'Backlinks' },
    { href: '/link-building', label: 'Link Building' },
    { href: '/backlink-quality', label: 'Backlink Quality' },
    { href: '/backlink-audit', label: 'Backlink Audit' },
    { href: '/link-building-tactics', label: 'Link Tactics' },
    { href: '/digital-pr', label: 'Digital PR' },
  ],
  tools: [
    { href: '/tools', label: 'All Tools' },
    { href: '/tools/free-backlink-checker', label: 'Free Backlink Checker' },
    { href: '/tools/backlink-analyzer', label: 'Backlink Audit Checklist' },
    { href: '/tools/roi-calculator', label: 'ROI Calculator' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/guides', label: 'Guides' },
    { href: '/glossary', label: 'Glossary' },
    { href: '/comparisons', label: 'Comparisons' },
    { href: '/statistics', label: 'Statistics' },
    { href: '/resources', label: 'Templates & Resources' },
  ],
  popular: [
    { href: '/guides/link-building-strategies-guide', label: 'Link Building Strategies' },
    { href: '/blog/best-guest-posting-sites-2026', label: 'Guest Posting Sites' },
    { href: '/blog/best-free-backlink-checkers', label: 'Free Backlink Checkers' },
    { href: '/comparisons/ahrefs-vs-moz', label: 'Ahrefs vs Moz' },
    { href: '/glossary/domain-authority', label: 'Domain Authority' },
  ],
  industries: [
    { href: '/industries/saas', label: 'SaaS' },
    { href: '/industries/ecommerce', label: 'E-commerce' },
    { href: '/industries/local-business', label: 'Local Business' },
    { href: '/industries/b2b', label: 'B2B' },
    { href: '/blog/link-building-for-startups', label: 'Startups' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/sitemap-page', label: 'Sitemap' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ],
}

const socialLinks = [
  { href: 'https://twitter.com/seobacklinks', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com/company/seobacklinks', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com/seobacklinks', icon: Github, label: 'GitHub' },
  { href: 'mailto:hello@backlinkgrid.com', icon: Mail, label: 'Email' },
]

export function Footer() {
  return (
    <footer className="bg-surface-100 border-t-2 border-surface-200">
      <div className="container-wide">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          {/* Top Section: Brand + Primary Links */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-12 pb-12 border-b border-surface-200">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-3">
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

            {/* Product Links */}
            <div className="md:col-span-2">
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

            {/* Learn Links */}
            <div className="md:col-span-2">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Learn
              </h3>
              <ul className="space-y-3">
                {footerLinks.learn.map((link) => (
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

            {/* Tools Links */}
            <div className="md:col-span-2">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Free Tools
              </h3>
              <ul className="space-y-3">
                {footerLinks.tools.map((link) => (
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

            {/* Resources Links */}
            <div className="md:col-span-2">
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
          </div>

          {/* Bottom Section: Popular, Industries, Company */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Popular Pages */}
            <div className="col-span-2 md:col-span-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Popular Pages
              </h3>
              <ul className="space-y-3">
                {footerLinks.popular.map((link) => (
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

            {/* Industries */}
            <div className="md:col-span-3">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Industries
              </h3>
              <ul className="space-y-3">
                {footerLinks.industries.map((link) => (
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

            {/* Company */}
            <div className="md:col-span-2">
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

            {/* Product CTA */}
            <div className="col-span-2 md:col-span-3">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-surface-950 mb-5">
                Get Started
              </h3>
              <p className="text-sm text-surface-600 mb-4">
                Claim a permanent dofollow backlink or download the verified backlink bundle.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#grid"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  Buy a Square
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/bundle"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface-950 text-white text-sm font-bold hover:bg-brand-blue transition-colors"
                >
                  View Bundle
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} BacklinkGrid. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-400 hidden sm:block">Built for searchable links</span>
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
