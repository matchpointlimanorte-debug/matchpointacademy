import { HeaderNav } from '@/components/HeaderNav'
import { BrandLogo } from '@/components/ui/BrandLogo'
import type { SeccionConfig } from '@/lib/data'
import { whatsappUrl } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

/** Encabezado: el menú se arma con las secciones visibles que tengan "Texto en el menú". */
export function Header({
  ajustes,
  secciones,
  hayTorneoPagina = false,
}: {
  ajustes: Ajustes
  secciones: SeccionConfig[]
  hayTorneoPagina?: boolean
}) {
  const items = secciones
    .filter((s) => s.visible && s.etiquetaMenu?.trim() && s.tipo !== 'hero')
    .map((s) => ({ href: `/#${s.tipo}`, label: s.etiquetaMenu!.trim() }))
  void hayTorneoPagina
  return (
    <HeaderNav
      items={items}
      whatsappHref={whatsappUrl(ajustes)}
      ctaTexto="Clase de prueba"
      logo={<BrandLogo ajustes={ajustes} className="h-12 w-auto md:h-14" priority />}
    />
  )
}
