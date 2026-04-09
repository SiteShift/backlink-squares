'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'
import { usePromo } from '@/components/promo'

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/about', label: 'About' },
]

const contentHubs = [
  { href: '/backlinks', label: 'Backlinks Fundamentals', description: 'Everything about backlinks' },
  { href: '/link-building', label: 'Link Building Strategy', description: 'Comprehensive strategies' },
  { href: '/backlink-quality', label: 'Quality & Risk', description: 'Evaluate and protect' },
  { href: '/backlink-audit', label: 'Backlink Audits', description: 'Analyze your profile' },
  { href: '/link-building-tactics', label: 'Tactics Library', description: 'Proven techniques' },
  { href: '/digital-pr', label: 'Digital PR', description: 'PR-driven links' },
  { href: '/outreach', label: 'Outreach', description: 'Prospecting, email, and follow-up' },
  { href: '/industries', label: 'Industries', description: 'Vertical-specific link building' },
  { href: '/resources', label: 'Resources', description: 'Templates, checklists, and tools' },
  { href: '/strategies', label: 'Strategies', description: 'Industry and tactic playbooks' },
  { href: '/comparisons', label: 'Comparisons', description: 'Compare SEO tools and services' },
  { href: '/statistics', label: 'Statistics', description: 'Benchmarks and industry data' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const { isBannerVisible } = usePromo()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLearnDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className={`fixed left-0 right-0 z-50 transition-[top] duration-300 ${isBannerVisible ? 'top-[48px] sm:top-[52px]' : 'top-0'}`}>
      {/* Glassmorphism background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/backlink-grid-logo.svg"
              alt="Backlink Grid"
              width={160}
              height={40}
              className="h-8 lg:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
              {/* Learn Dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                  className="relative px-4 py-2 text-sm font-semibold text-surface-600 hover:text-surface-950 transition-colors group flex items-center gap-1"
                >
                  Learn
                  <ChevronDown className={`w-4 h-4 transition-transform ${learnDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {learnDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-[28rem] bg-white border-2 border-surface-950 shadow-brutal py-2"
                    >
                      <div className="grid grid-cols-2 gap-x-2">
                        {contentHubs.map((hub) => (
                          <Link
                            key={hub.href}
                            href={hub.href}
                            onClick={() => setLearnDropdownOpen(false)}
                            className="block px-4 py-3 hover:bg-surface-50 transition-colors"
                          >
                            <span className="block text-sm font-semibold text-surface-950">{hub.label}</span>
                            <span className="block text-xs text-surface-500 mt-0.5">{hub.description}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-surface-200 mt-2 pt-2 px-4 pb-2">
                        <div className="flex items-center justify-between gap-4">
                          <Link
                            href="/guides"
                            onClick={() => setLearnDropdownOpen(false)}
                            className="text-sm font-semibold text-brand-red hover:underline"
                          >
                            View Guides →
                          </Link>
                          <Link
                            href="/sitemap-page"
                            onClick={() => setLearnDropdownOpen(false)}
                            className="text-sm font-semibold text-surface-600 hover:text-surface-950"
                          >
                            Full Sitemap
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-semibold text-surface-600 hover:text-surface-950 transition-colors group"
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link href="/#grid" className="hidden sm:block">
              <motion.button
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold
                         bg-surface-950 text-white border-2 border-surface-950
                         hover:bg-brand-red hover:border-brand-red
                         transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get a Backlink</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative w-11 h-11 flex items-center justify-center
                       bg-white border-2 border-surface-950
                       hover:bg-brand-yellow transition-colors"
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: '2px 2px 0 0 #09090B' }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full screen overlay for better UX */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-[-1]"
            style={{ top: isBannerVisible ? '48px' : '0' }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-surface-950/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel - positioned below header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 bg-white border-b-2 border-surface-950 flex flex-col"
              style={{
                top: isBannerVisible ? '56px' : '56px',
                maxHeight: isBannerVisible ? 'calc(100vh - 104px)' : 'calc(100vh - 56px)',
              }}
            >
              {/* Scrollable content area */}
              <nav className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-2">
                {/* Learn Section */}
                <div className="mb-3">
                  <p className="px-3 text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">Learn</p>
                  <ul className="space-y-0.5">
                    {contentHubs.map((hub, index) => (
                      <motion.li
                        key={hub.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 + 0.05 }}
                      >
                        <Link
                          href={hub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-[15px] font-semibold text-surface-700
                                   active:bg-surface-100 hover:bg-surface-50
                                   border-l-2 border-transparent active:border-brand-red
                                   transition-colors rounded-r-lg"
                        >
                          {hub.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Main Nav */}
                <div className="border-t border-surface-200 pt-3">
                  <ul className="space-y-0.5">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 + 0.15 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 text-base font-semibold text-surface-700
                                   active:bg-surface-100 hover:bg-surface-50
                                   border-l-2 border-transparent active:border-brand-red
                                   transition-colors rounded-r-lg"
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </nav>

              {/* Sticky CTA at bottom - always visible */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0 px-4 py-4 border-t border-surface-200 bg-white safe-area-bottom"
              >
                <Link href="/#grid" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-red w-full justify-center text-base py-3.5">
                    Get a Backlink
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
