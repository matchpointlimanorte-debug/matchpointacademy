'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Video de fondo del hero. Solo se carga en pantallas anchas, sin "ahorro de datos"
 * y sin preferencia de movimiento reducido, y después del primer pintado (no afecta al LCP).
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const [activo, setActivo] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const ok =
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !conn?.saveData
    if (!ok) return
    const t = window.setTimeout(() => setActivo(true), 1200)
    return () => window.clearTimeout(t)
  }, [])

  if (!activo) return null
  return (
    <video
      ref={ref}
      className="absolute inset-0 -z-10 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
