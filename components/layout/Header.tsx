'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, ExternalLink } from 'lucide-react'

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/blog', label: 'Blog' },
  { href: '/guides', label: 'Guides' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background with blur effect on scroll */}
      <motion.div
        className="absolute inset-0 border-b-2 border-surface-950/10"
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(250, 250, 249, 0.95)' : 'rgba(250, 250, 249, 1)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.2 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Animated logo mark */}
            <div className="relative w-10 h-10 lg:w-11 lg:h-11">
              {/* Base grid */}
              <div className="absolute inset-0 grid grid-cols-3 gap-[2px] p-[2px] bg-surface-950">
                {/* Row 1 */}
                <motion.div
                  className="bg-brand-red"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
                <motion.div
                  className="bg-brand-red"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, delay: 0.02 }}
                />
                <div className="bg-white" />
                {/* Row 2 */}
                <motion.div
                  className="bg-brand-red"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
                <motion.div
                  className="bg-brand-yellow group-hover:bg-brand-blue transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
                <div className="bg-white" />
                {/* Row 3 */}
                <div className="bg-white" />
                <div className="bg-white" />
                <motion.div
                  className="bg-brand-blue"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
              </div>
            </div>

            {/* Logo text */}
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-sm lg:text-base tracking-tight text-surface-950">
                BACKLINK
              </span>
              <span className="font-display font-black text-sm lg:text-base tracking-tight text-brand-red">
                GRID
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
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
                <span>Get Started</span>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-surface-950/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-surface-950 overflow-hidden"
            >
              <nav className="px-4 py-6">
                <ul className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-surface-700
                                 hover:text-surface-950 hover:bg-surface-50
                                 border-l-2 border-transparent hover:border-brand-red
                                 transition-all"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 pt-6 border-t border-surface-200"
                >
                  <Link href="/#grid" onClick={() => setMobileMenuOpen(false)}>
                    <button className="btn-red w-full justify-center">
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
