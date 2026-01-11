'use client'

import { motion } from 'framer-motion'
import { Grid3X3, Users, TrendingUp, Link as LinkIcon } from 'lucide-react'

interface StatsProps {
  totalSold: number
  totalAvailable: number
  domainAuthority: number
  totalSites: number
}

export function Stats({
  totalSold = 847,
  totalAvailable = 12453,
  domainAuthority = 15,
  totalSites = 423,
}: StatsProps) {
  const stats = [
    {
      label: 'Squares Sold',
      value: totalSold.toLocaleString(),
      icon: Grid3X3,
      color: 'red',
    },
    {
      label: 'Sites Listed',
      value: totalSites.toLocaleString(),
      icon: Users,
      color: 'yellow',
    },
    {
      label: 'Domain Authority',
      value: domainAuthority.toString(),
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Squares Available',
      value: totalAvailable.toLocaleString(),
      icon: LinkIcon,
      color: 'red',
    },
  ]

  const colorClasses = {
    red: {
      bg: 'bg-bauhaus-red',
      text: 'text-bauhaus-red',
    },
    yellow: {
      bg: 'bg-bauhaus-yellow',
      text: 'text-dark',
    },
    blue: {
      bg: 'bg-bauhaus-blue',
      text: 'text-bauhaus-blue',
    },
  }

  return (
    <section className="py-16 bg-white border-y-3 border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const colors = colorClasses[stat.color as keyof typeof colorClasses]
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 ${colors.bg} border-3 border-dark mb-4`}
                >
                  <stat.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <p className={`text-4xl lg:text-5xl font-black ${colors.text}`}>
                  {stat.value}
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-dark/60 mt-2">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
