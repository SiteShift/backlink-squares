'use client'
import { useEffect } from 'react'
import { track } from '@vercel/analytics'
export function ConversionTracking() {
  useEffect(() => {
    function click(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest('a[data-conversion]') : null
      const placement = target?.getAttribute('data-conversion')
      if (placement) track('bundle_interest', { placement })
    }
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  }, [])
  return null
}
