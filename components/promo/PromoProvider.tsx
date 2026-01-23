'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface PromoContextType {
  isBannerVisible: boolean
}

const PromoContext = createContext<PromoContextType>({
  isBannerVisible: false,
})

export function usePromo() {
  return useContext(PromoContext)
}

export function PromoProvider({ children }: { children: ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsBannerVisible(true)
  }, [])

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
    <PromoContext.Provider value={{ isBannerVisible }}>
      {children}
    </PromoContext.Provider>
  )
}
