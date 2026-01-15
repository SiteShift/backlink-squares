'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'What is a dofollow backlink?',
    answer:
      'A dofollow backlink is a link that passes "link equity" or "link juice" to your website. Unlike nofollow links, dofollow links tell search engines to follow the link and count it as a vote of confidence for your site, which can help improve your search rankings.',
  },
  {
    question: 'How quickly will my square appear on the grid?',
    answer:
      'Your square appears instantly after your payment is confirmed. There\'s no waiting period or manual approval process. As soon as Stripe confirms your payment, your logo and link go live on the grid.',
  },
  {
    question: 'Is this a permanent backlink?',
    answer:
      'Yes! When you purchase a square, you get a permanent, lifetime placement on the grid. There are no monthly fees, no renewals, and no risk of your link being removed. Your backlink stays active as long as our site exists.',
  },
  {
    question: 'Can I buy multiple squares?',
    answer:
      'Absolutely! You can select up to 100 squares anywhere on the grid - they don\'t need to be next to each other. Buy scattered squares across the grid for maximum exposure, or group them together for a larger logo. The price scales linearly: $1 per square.',
  },
  {
    question: 'How does this help my SEO?',
    answer:
      'Every square on our grid includes a real, crawlable dofollow link. As our domain authority grows through our content and links, the value of your backlink increases too. You\'re essentially getting in early on a growing SEO asset.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Due to the nature of this product (instant, permanent backlinks), we generally don\'t offer refunds once your square is live. However, if there\'s an issue with your purchase, please contact us and we\'ll work to make it right.',
  },
]

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`
        border-2 border-surface-950 bg-white transition-all duration-200
        ${isOpen ? 'shadow-brutal' : 'shadow-none hover:shadow-brutal-sm'}
      `}
    >
      <button
        onClick={onClick}
        className="w-full p-5 sm:p-6 flex items-start gap-4 text-left group"
      >
        {/* Toggle icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 border-2 border-surface-950 flex items-center justify-center
          transition-colors duration-200
          ${isOpen ? 'bg-brand-red' : 'bg-surface-100 group-hover:bg-brand-yellow'}
        `}>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="minus"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Minus className="w-5 h-5 text-white" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Plus className="w-5 h-5 text-surface-950" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question */}
        <span className={`
          font-display font-bold text-base sm:text-lg leading-tight pt-2
          transition-colors duration-200
          ${isOpen ? 'text-brand-red' : 'text-surface-950 group-hover:text-surface-700'}
        `}>
          {question}
        </span>
      </button>

      {/* Answer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pl-[4.5rem] sm:pl-20">
              <p className="text-surface-600 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-grid opacity-30" />

      {/* Decorative elements */}
      <div className="absolute top-20 -right-16 w-32 h-32 bg-brand-yellow border-2 border-surface-950 opacity-20" />
      <div className="absolute bottom-20 -left-12 w-24 h-24 bg-brand-red rounded-full border-2 border-surface-950 opacity-20" />

      <div className="container-tight relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mx-auto mb-8"
          >
            <span className="section-label-dot bg-brand-yellow" />
            <span>FAQ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
          >
            Frequently Asked{' '}
            <span className="text-brand-yellow">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-surface-600"
          >
            Everything you need to know about backlink squares
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-surface-50 border border-surface-200 rounded-lg">
            <HelpCircle className="w-5 h-5 text-surface-400" />
            <span className="text-surface-600">Still have questions?</span>
            <a
              href="/contact"
              className="font-bold text-brand-red hover:underline"
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
