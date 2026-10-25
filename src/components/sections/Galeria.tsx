import { GaleriaGrid, type FotoItem } from '@/components/sections/GaleriaGrid'
import { Section } from '@/components/ui/Section'
import type { SeccionConfig } from '@/lib/data'
import { medio, urlMedio } from '@/lib/site'
import type { FotoGaleria } from '@/lib/types'

export function Galeria({ fotos, cfg }: { fotos: FotoGaleria[]; cfg: SeccionConfig }) {
  const items: FotoItem[] = fotos.flatMap((f) => {
    const m = medio(f.imagen)
    if (!m) return []
    return [
      {
        id: f.id,
        thumb: urlMedio(m, 'card') || '',
        full: urlMedio(m, 'hero') || '',
        alt: m.alt || f.titulo,
        titulo: f.titulo,
        w: m.sizes?.card?.width || m.width || 800,
        h: m.sizes?.card?.height || m.height || 600,
      },
    ]
  })
  if (items.length === 0) return null
  return (
    <Section id="galeria" tone="light" eyebrow="Galería" titulo={cfg.titulo || 'Vive la experiencia Match Point'} subtitulo={cfg.subtitulo}>
      <GaleriaGrid fotos={items} />
    </Section>
  )
}
