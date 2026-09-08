'use client'
import { createContext, useContext, ReactNode } from 'react'
const PromoContext = createContext({ isBannerVisible: true })
export function usePromo() { return useContext(PromoContext) }
export function PromoProvider({ children }: { children: ReactNode }) {
  return <PromoContext.Provider value={{ isBannerVisible: true }}>{children}</PromoContext.Provider>
}
