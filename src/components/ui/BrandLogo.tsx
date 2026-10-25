import Image from 'next/image'

import { medio, urlMedio } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

/**
 * Logo de la marca Match Point Lima Norte:
 * Combina el isotipo de pelota de tenis en pin con la tipografía y el rectángulo amarillo
 * característico del logo original (MatchPoint / LIMA NORTE).
 */
export function BrandLogo({
  ajustes,
  className = 'h-11 w-auto md:h-12',
  priority = false,
  showText = true,
}: {
  ajustes: Ajustes
  className?: string
  priority?: boolean
  showText?: boolean
}) {
  const m = medio(ajustes.logo)
  const isCustomLogo = Boolean(m?.filename && m.filename !== 'logo.png')
  const iconSrc = isCustomLogo ? urlMedio(m) || '/images/icono.png' : '/images/icono.png'

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative shrink-0">
        <Image
          src={iconSrc}
          alt={`Logo de ${ajustes.nombreSitio || 'Match Point Lima Norte'}`}
          width={80}
          height={88}
          priority={priority}
          sizes="90px"
          className={`${className} object-contain transition-transform duration-200 hover:scale-105`}
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className="font-display text-xl font-black tracking-tight text-brand md:text-2xl">
            Match<span className="text-brand">Point</span>
          </span>
          <span className="mt-1 inline-block self-start rounded-xs bg-accent px-1.5 py-0.5 font-sans text-[0.68rem] font-black uppercase tracking-widest text-brand shadow-xs">
            Lima Norte
          </span>
        </div>
      )}
    </div>
  )
}

