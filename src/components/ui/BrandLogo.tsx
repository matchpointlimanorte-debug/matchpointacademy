import Image from 'next/image'

import { medio, urlMedio } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

/** Logo de la marca (el original, sin alterar). Usa el del admin o el archivo por defecto. */
export function BrandLogo({
  ajustes,
  className = 'h-14 w-auto',
  priority = false,
}: {
  ajustes: Ajustes
  className?: string
  priority?: boolean
}) {
  const m = medio(ajustes.logo)
  const src = urlMedio(m) || '/logo.png'
  return (
    <Image
      src={src}
      alt={`Logo de ${ajustes.nombreSitio || 'Match Point Lima Norte'}`}
      width={m?.width || 687}
      height={m?.height || 564}
      priority={priority}
      sizes="120px"
      className={className}
    />
  )
}
