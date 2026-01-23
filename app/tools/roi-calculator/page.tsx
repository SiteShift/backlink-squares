'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  Info,
  Link as LinkIcon,
  Sparkles,
  Database,
  BarChart3,
  CheckCircle2
} from 'lucide-react'

interface InputFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  min?: number
  max?: number
  step?: number
  hint?: string
}

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  hint
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold uppercase tracking-wider text-surface-950">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 font-medium">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`w-full py-3 text-base bg-white border-2 border-surface-300
                     placeholder:text-surface-400 text-surface-950
                     focus:outline-none focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]
                     transition-all duration-150 ${prefix ? 'pl-10 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 font-medium">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p className="text-sm text-surface-500">{hint}</p>
      )}
    </div>
  )
}

interface ResultCardProps {
  label: string
  value: string
  subValue?: string
  icon: React.ElementType
  color: 'red' | 'blue' | 'yellow' | 'green'
  highlight?: boolean
}

function ResultCard({ label, value, subValue, icon: Icon, color, highlight }: ResultCardProps) {
  const colorClasses = {
    red: 'bg-brand-red/10 text-brand-red',
    blue: 'bg-brand-blue/10 text-brand-blue',
    yellow: 'bg-brand-yellow/20 text-yellow-600',
    green: 'bg-green-100 text-green-600'
  }

  const borderColor = {
    red: 'border-brand-red',
    blue: 'border-brand-blue',
    yellow: 'border-brand-yellow',
    green: 'border-green-500'
  }

  return (
    <div
      className={`bg-white border-2 ${highlight ? borderColor[color] : 'border-surface-200'} p-6 transition-all duration-200 hover:border-surface-400`}
      style={highlight ? { boxShadow: '4px 4px 0px 0px #09090B' } : undefined}
    >
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-surface-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-black ${highlight ? 'text-surface-950' : 'text-surface-700'}`}>{value}</p>
      {subValue && (
        <p className="text-sm text-surface-500 mt-1">{subValue}</p>
      )}
    </div>
  )
}

export default function ROICalculatorPage() {
  // Input state
  const [monthlyBudget, setMonthlyBudget] = useState(500)
  const [costPerLink, setCostPerLink] = useState(100)
  const [currentTraffic, setCurrentTraffic] = useState(10000)
  const [conversionRate, setConversionRate] = useState(2)
  const [orderValue, setOrderValue] = useState(100)
  const [trafficIncreasePerLink, setTrafficIncreasePerLink] = useState(1.5)

  // Calculated values
  const calculations = useMemo(() => {
    // Links per month
    const linksPerMonth = costPerLink > 0 ? Math.floor(monthlyBudget / costPerLink) : 0

    // Traffic increase percentage (cumulative over 12 months)
    const monthlyTrafficIncreasePercent = linksPerMonth * trafficIncreasePerLink
    const yearlyTrafficMultiplier = Math.pow(1 + monthlyTrafficIncreasePercent / 100, 12)

    // Projected monthly traffic after 12 months
    const projectedTraffic = Math.round(currentTraffic * yearlyTrafficMultiplier)
    const trafficIncrease = projectedTraffic - currentTraffic

    // Conversions
    const currentConversions = Math.round(currentTraffic * (conversionRate / 100))
    const projectedConversions = Math.round(projectedTraffic * (conversionRate / 100))
    const additionalConversions = projectedConversions - currentConversions

    // Revenue
    const currentRevenue = currentConversions * orderValue
    const projectedRevenue = projectedConversions * orderValue
    const additionalRevenue = projectedRevenue - currentRevenue

    // Investment over 12 months
    const yearlyInvestment = monthlyBudget * 12

    // ROI calculation
    const roi = yearlyInvestment > 0
      ? ((additionalRevenue - yearlyInvestment) / yearlyInvestment) * 100
      : 0

    // Break-even (months to recover investment)
    const monthlyAdditionalRevenue = additionalRevenue / 12
    const breakEvenMonths = monthlyAdditionalRevenue > 0
      ? Math.ceil(yearlyInvestment / monthlyAdditionalRevenue)
      : Infinity

    return {
      linksPerMonth,
      trafficIncrease,
      projectedTraffic,
      additionalConversions,
      projectedConversions,
      additionalRevenue,
      projectedRevenue,
      yearlyInvestment,
      roi,
      breakEvenMonths,
      currentRevenue,
      currentConversions
    }
  }, [monthlyBudget, costPerLink, currentTraffic, conversionRate, orderValue, trafficIncreasePerLink])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value / 100)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface-50">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-white border-b-2 border-surface-200 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-blue/10 translate-y-1/2 -translate-x-1/2 rounded-full" />

          <div className="container-wide relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="section-label mx-auto mb-8">
                <span className="section-label-dot bg-brand-blue" />
                <span>Free Tool</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                Link Building{' '}
                <span className="text-brand-red">ROI Calculator</span>
              </h1>

              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                Calculate the potential return on investment for your link building campaigns.
                Understand how backlinks can impact your traffic, conversions, and revenue.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <div>
                <div className="bg-white border-2 border-surface-950 p-8" style={{ boxShadow: '6px 6px 0px 0px #09090B' }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-brand-blue flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-black text-surface-950">
                        Enter Your Details
                      </h2>
                      <p className="text-sm text-surface-500">Customize the inputs for your business</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <InputField
                      label="Monthly Link Building Budget"
                      value={monthlyBudget}
                      onChange={setMonthlyBudget}
                      prefix="$"
                      min={0}
                      step={50}
                      hint="How much you plan to spend on link building each month"
                    />

                    <InputField
                      label="Average Cost Per Link"
                      value={costPerLink}
                      onChange={setCostPerLink}
                      prefix="$"
                      min={1}
                      step={10}
                      hint="The average cost to acquire one quality backlink"
                    />

                    <InputField
                      label="Current Monthly Organic Traffic"
                      value={currentTraffic}
                      onChange={setCurrentTraffic}
                      min={0}
                      step={100}
                      hint="Your current monthly visitors from organic search"
                    />

                    <InputField
                      label="Conversion Rate"
                      value={conversionRate}
                      onChange={setConversionRate}
                      suffix="%"
                      min={0}
                      max={100}
                      step={0.1}
                      hint="Percentage of visitors who become customers"
                    />

                    <InputField
                      label="Average Order/Lead Value"
                      value={orderValue}
                      onChange={setOrderValue}
                      prefix="$"
                      min={0}
                      step={10}
                      hint="Average revenue per conversion"
                    />

                    <InputField
                      label="Traffic Increase Per Quality Backlink"
                      value={trafficIncreasePerLink}
                      onChange={setTrafficIncreasePerLink}
                      suffix="%"
                      min={0}
                      max={10}
                      step={0.1}
                      hint="Expected monthly traffic growth per acquired backlink"
                    />
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-brand-yellow/10 border-2 border-brand-yellow/30">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-surface-600">
                      <p className="font-semibold text-surface-700 mb-1">Disclaimer</p>
                      <p>
                        These calculations are estimates based on industry averages. Actual results
                        may vary based on link quality, your niche, competition, content quality,
                        and other SEO factors. Use these figures for planning purposes only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div>
                <div className="bg-surface-950 text-white p-8 mb-8" style={{ boxShadow: '6px 6px 0px 0px #DC2626' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-brand-red flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-black">
                        12-Month Projection
                      </h2>
                      <p className="text-sm text-white/60">Based on your inputs</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 p-4">
                      <p className="text-sm text-white/60 mb-1">ROI</p>
                      <p className={`text-3xl font-black ${calculations.roi >= 0 ? 'text-green-400' : 'text-brand-red'}`}>
                        {calculations.roi === Infinity ? 'N/A' : `${calculations.roi.toFixed(0)}%`}
                      </p>
                    </div>
                    <div className="bg-white/10 p-4">
                      <p className="text-sm text-white/60 mb-1">Break-Even</p>
                      <p className="text-3xl font-black text-brand-yellow">
                        {calculations.breakEvenMonths === Infinity ? 'N/A' : `${calculations.breakEvenMonths} mo`}
                      </p>
                    </div>
                  </div>

                  {/* Monthly Output */}
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <LinkIcon className="w-4 h-4 text-brand-yellow" />
                      <span className="text-sm font-semibold">Monthly Link Acquisition</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black">{calculations.linksPerMonth}</span>
                      <span className="text-white/60">links per month</span>
                    </div>
                    <p className="text-sm text-white/50 mt-2">
                      {calculations.linksPerMonth * 12} total links over 12 months
                    </p>
                  </div>
                </div>

                {/* Result Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <ResultCard
                    label="Projected Traffic"
                    value={formatNumber(calculations.projectedTraffic)}
                    subValue={`+${formatNumber(calculations.trafficIncrease)} visitors`}
                    icon={TrendingUp}
                    color="blue"
                  />
                  <ResultCard
                    label="Additional Conversions"
                    value={formatNumber(calculations.additionalConversions)}
                    subValue="per month"
                    icon={Target}
                    color="yellow"
                  />
                  <ResultCard
                    label="Additional Revenue"
                    value={formatCurrency(calculations.additionalRevenue)}
                    subValue="over 12 months"
                    icon={DollarSign}
                    color="green"
                    highlight
                  />
                  <ResultCard
                    label="Total Investment"
                    value={formatCurrency(calculations.yearlyInvestment)}
                    subValue="over 12 months"
                    icon={Clock}
                    color="red"
                  />
                </div>

                {/* Comparison Table */}
                <div className="mt-8 bg-white border-2 border-surface-200 overflow-hidden">
                  <div className="bg-surface-100 px-6 py-4 border-b-2 border-surface-200">
                    <h3 className="font-bold uppercase tracking-wider text-surface-950">Before vs After</h3>
                  </div>
                  <div className="divide-y divide-surface-200">
                    <div className="grid grid-cols-3 px-6 py-4">
                      <div className="font-medium text-surface-500">Metric</div>
                      <div className="font-medium text-surface-500 text-center">Current</div>
                      <div className="font-medium text-surface-500 text-center">After 12 Months</div>
                    </div>
                    <div className="grid grid-cols-3 px-6 py-4">
                      <div className="text-surface-700">Monthly Traffic</div>
                      <div className="text-center text-surface-600">{formatNumber(currentTraffic)}</div>
                      <div className="text-center font-semibold text-brand-blue">{formatNumber(calculations.projectedTraffic)}</div>
                    </div>
                    <div className="grid grid-cols-3 px-6 py-4">
                      <div className="text-surface-700">Monthly Conversions</div>
                      <div className="text-center text-surface-600">{formatNumber(calculations.currentConversions)}</div>
                      <div className="text-center font-semibold text-brand-blue">{formatNumber(calculations.projectedConversions)}</div>
                    </div>
                    <div className="grid grid-cols-3 px-6 py-4">
                      <div className="text-surface-700">Monthly Revenue</div>
                      <div className="text-center text-surface-600">{formatCurrency(calculations.currentRevenue)}</div>
                      <div className="text-center font-semibold text-green-600">{formatCurrency(calculations.projectedRevenue)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Sections */}
        <section className="py-16 bg-white border-t-2 border-surface-200">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-black text-surface-950 mb-4">
                Start Building Your Backlink Portfolio
              </h2>
              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                Now that you know the potential ROI, take the first step with our affordable options.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Grid CTA */}
              <div className="bg-white border-2 border-surface-950 p-8" style={{ boxShadow: '4px 4px 0px 0px #09090B' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-red flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-red">Most Affordable</p>
                    <h3 className="font-display text-xl font-black text-surface-950">$1 Backlink Grid</h3>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    'Permanent dofollow backlink',
                    'Instant activation',
                    'Your logo displayed on grid',
                    'No monthly fees'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-surface-600">
                      <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-black text-surface-950">$1</span>
                  <span className="text-surface-500">per square</span>
                </div>

                <Link href="/#grid">
                  <Button variant="red" size="lg" className="w-full group">
                    Claim Your Square
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Bundle CTA */}
              <div className="bg-surface-950 text-white p-8" style={{ boxShadow: '4px 4px 0px 0px #DC2626' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-yellow flex items-center justify-center">
                    <Database className="w-6 h-6 text-surface-950" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-yellow">Best Value</p>
                    <h3 className="font-display text-xl font-black">Backlink Database Bundle</h3>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    '270+ verified backlink sites',
                    'High DR dofollow opportunities',
                    'Direct submission URLs',
                    'Save 20+ hours of research'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-brand-yellow">$14.49</span>
                  <span className="text-lg line-through text-white/50">$49</span>
                  <span className="bg-brand-red px-2 py-0.5 text-xs font-bold">70% OFF</span>
                </div>

                <Link href="/bundle">
                  <Button variant="yellow" size="lg" className="w-full group">
                    Get the Bundle
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="py-16 bg-surface-100">
          <div className="container-wide text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-surface-500 mb-4">
              More Free Tools
            </p>
            <h2 className="font-display text-2xl font-black text-surface-950 mb-8">
              Explore Our SEO Tools
            </h2>
            <Link href="/tools">
              <Button variant="secondary" className="group">
                View All Tools
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
