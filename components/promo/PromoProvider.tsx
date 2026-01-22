'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const BANNER_DISMISSED_KEY = 'backlink-bundle-banner-dismissed'

interface PromoContextType {
  isBannerVisible: boolean
  dismissBanner: () => void
}

const PromoContext = createContext<PromoContextType>({
  isBannerVisible: false,
  dismissBanner: () => {},
})

export function usePromo() {
  return useContext(PromoContext)
}

export function PromoProvider({ children }: { children: ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY)
    if (!dismissed) {
      setIsBannerVisible(true)
    }
  }, [])

  const dismissBanner = () => {
    setIsBannerVisible(false)
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true')
  }

  // Apply CSS class to body for header positioning
  useEffect(() => {
    if (mounted) {
      if (isBannerVisible) {
        document.body.classList.add('promo-banner-visible')
      } else {
        document.body.classList.remove('promo-banner-visible')
      }
    }
  }, [isBannerVisible, mounted])

  return (
    <PromoContext.Provider value={{ isBannerVisible, dismissBanner }}>
      {children}
    </PromoContext.Provider>
  )
}
