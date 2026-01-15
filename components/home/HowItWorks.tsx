'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MousePointer, CreditCard, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MousePointer,
    title: 'Select',
    subtitle: 'Choose Your Squares',
    description: 'Click on any empty squares in the grid. Select multiple squares anywhere - they don\'t need to be connected.',
    features: ['Interactive grid selection', 'Real-time preview', 'Multi-square support'],
    color: 'red',
    bgColor: 'bg-accent-red-50',
    borderColor: 'border-brand-red',
    iconBg: 'bg-brand-red',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Customize',
    subtitle: 'Add Your Details',
    description: 'Enter your website URL, site name, and upload your logo. See exactly how your square will appear on the grid.',
    features: ['Custom branding', 'Logo upload', 'Live preview'],
    color: 'blue',
    bgColor: 'bg-accent-blue-50',
    borderColor: 'border-brand-blue',
    iconBg: 'bg-brand-blue',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Launch',
    subtitle: 'Go Live Instantly',
    description: 'Pay securely via Stripe. Your square and permanent dofollow backlink go live immediately - no waiting.',
    features: ['Instant activation', 'Secure payment', 'Permanent placement'],
    color: 'yellow',
    bgColor: 'bg-accent-yellow-50',
    borderColor: 'border-brand-yellow',
    iconBg: 'bg-brand-yellow',
  },
]

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="section-padding bg-surface-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 -left-20 w-40 h-40 bg-brand-red/5 border border-brand-red/10"
        animate={{ rotate: 45 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-20 -right-20 w-48 h-48 rounded-full bg-brand-blue/5 border border-brand-blue/10"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-wide relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mx-auto mb-8"
          >
            <span className="section-label-dot bg-brand-blue" />
            <span>How It Works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
          >
            Three Simple Steps to{' '}
            <span className="text-brand-blue">Your Backlink</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-surface-600 max-w-2xl mx-auto"
          >
            From selection to live backlink in under 5 minutes. No complicated outreach, no negotiations, no waiting.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-surface-200" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className="relative"
              >
                {/* Step number circle - positioned on the line */}
                <div className="hidden lg:flex absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-2 border-surface-950 items-center justify-center z-10">
                  <span className="font-display font-black text-lg">{step.number}</span>
                </div>

                {/* Card */}
                <div
                  className={`relative h-full bg-white border-2 border-surface-950 p-8 transition-all duration-300 hover:-translate-y-2 group`}
                  style={{ boxShadow: '6px 6px 0 0 #09090B' }}
                >
                  {/* Mobile step number */}
                  <div className="lg:hidden absolute -top-4 left-6 px-3 py-1 bg-surface-950 text-white text-sm font-bold">
                    Step {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.iconBg} border-2 border-surface-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-8 h-8 ${step.color === 'yellow' ? 'text-surface-950' : 'text-white'}`} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="font-display text-2xl font-black uppercase tracking-wide mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-surface-500 uppercase tracking-wider">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-surface-600 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-surface-600">
                        <CheckCircle2 className={`w-4 h-4 ${step.color === 'red' ? 'text-brand-red' : step.color === 'blue' ? 'text-brand-blue' : 'text-brand-yellow'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <a href="#grid" className="btn-red group">
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="mt-4 text-sm text-surface-500">
            No account required. Pay once, link forever.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
