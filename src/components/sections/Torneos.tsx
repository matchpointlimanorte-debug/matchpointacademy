import Link from 'next/link'

import { TorneoCard } from '@/components/sections/TorneoCard'
import { IconArrow } from '@/components/ui/Icons'
import { Section } from '@/components/ui/Section'
import type { SeccionConfig } from '@/lib/data'
import { esTorneoFinalizado } from '@/lib/site'
import type { Ajustes, Torneo } from '@/lib/types'

/** Separa torneos en próximos (más cercano primero) y pasados (más reciente primero). */
export function separarTorneos(torneos: Torneo[]) {
  const ts = (t: Torneo) => (t.fechaInicio ? new Date(t.fechaInicio).getTime() : Number.MAX_SAFE_INTEGER)
  const proximos = torneos.filter((t) => !esTorneoFinalizado(t)).sort((a, b) => ts(a) - ts(b))
  const pasados = torneos.filter(esTorneoFinalizado).sort((a, b) => ts(b) - ts(a))
  return { proximos, pasados }
}

export function Torneos({ torneos, ajustes, cfg }: { torneos: Torneo[]; ajustes: Ajustes; cfg: SeccionConfig }) {
  const { proximos, pasados } = separarTorneos(torneos)
  if (proximos.length === 0 && pasados.length === 0) return null
  return (
    <Section
      id="torneos"
      tone="dark"
      eyebrow="Competencia"
      titulo={cfg.titulo || 'Torneos'}
      subtitulo={cfg.subtitulo || 'Compite, mide tu progreso y vive el ambiente de los torneos Match Point.'}
    >
      {proximos.length > 0 && (
        <>
          <h3 className="mb-5 text-xl !text-accent">Próximos torneos</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proximos.slice(0, 3).map((t) => (
              <TorneoCard key={t.id} t={t} ajustes={ajustes} />
            ))}
          </div>
        </>
      )}
      {pasados.length > 0 && (
        <>
          <h3 className="mb-5 mt-14 text-xl !text-accent">Resultados anteriores</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pasados.slice(0, 3).map((t) => (
              <TorneoCard key={t.id} t={t} ajustes={ajustes} pasado />
            ))}
          </div>
        </>
      )}
      <div className="mt-10">
        <Link href="/torneos" className="btn btn-ghost text-white">
          Ver todos los torneos <IconArrow width={20} height={20} />
        </Link>
      </div>
    </Section>
  )
}
