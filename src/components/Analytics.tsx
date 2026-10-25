'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Google Analytics 4 (gratis). Se carga con baja prioridad para no afectar al rendimiento.
 * Registra clics en elementos con data-event="..." (p. ej. los botones de WhatsApp).
 */
export function Analytics({ gaId }: { gaId?: string | null }) {
  useEffect(() => {
    if (!gaId) return
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-event]')
      if (!el || !window.gtag) return
      window.gtag('event', el.dataset.event, { ubicacion: el.dataset.label || 'sin_etiqueta' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [gaId])

  if (!gaId || !/^G-[A-Z0-9]+$/i.test(gaId)) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  )
}
