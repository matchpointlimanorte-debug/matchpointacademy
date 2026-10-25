import Image from 'next/image'
import Link from 'next/link'

import { IconArrow, IconCalendar, IconPin, IconTrophy, IconWhatsApp } from '@/components/ui/Icons'
import { fechaTorneo, inscripcionTorneo, medio, urlMedio } from '@/lib/site'
import type { Ajustes, Torneo } from '@/lib/types'

/** Tarjeta de torneo (landing y página /torneos). */
export function TorneoCard({ t, ajustes, pasado = false }: { t: Torneo; ajustes: Ajustes; pasado?: boolean }) {
  const afiche = medio(t.afiche)
  const inscripcion = pasado ? null : inscripcionTorneo(t, ajustes)
  return (
    <article className="reveal card card-hover flex flex-col overflow-hidden">
      {afiche ? (
        <div className="relative aspect-[16/10] bg-brand-soft">
          <Image src={urlMedio(afiche, 'card') || ''} alt={afiche.alt || t.titulo} fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover" />
        </div>
      ) : (
        <div aria-hidden="true" className="relative flex aspect-[16/7] items-center justify-center bg-brand text-accent">
          <IconTrophy width={64} height={64} />
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-extrabold">{t.titulo}</h3>
        <ul className="mt-3 space-y-1.5 text-sm text-ink/80">
          <li className="flex items-center gap-2">
            <IconCalendar width={18} height={18} className="text-court" /> {fechaTorneo(t)}
          </li>
          {t.categoria && (
            <li className="flex items-center gap-2">
              <IconTrophy width={18} height={18} className="text-court" /> {t.categoria}
            </li>
          )}
          {t.lugar && (
            <li className="flex items-center gap-2">
              <IconPin width={18} height={18} className="text-court" /> {t.lugar}
            </li>
          )}
        </ul>
        {t.resumen && <p className="mt-3 text-ink/75">{t.resumen}</p>}
        {t.costo && !pasado && <p className="mt-2 text-sm font-bold text-brand">Inscripción: {t.costo}</p>}

        {pasado && t.resultados && t.resultados.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm">
            {t.resultados.map((r) => (
              <li key={r.id || r.categoria} className="rounded-xl bg-brand-soft px-3 py-2">
                <strong className="text-brand">{r.categoria}</strong>
                {r.campeon && <span> · 🥇 {r.campeon}</span>}
                {r.subcampeon && <span> · 🥈 {r.subcampeon}</span>}
                {r.tercero && <span> · 🥉 {r.tercero}</span>}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          {inscripcion ? (
            <a
              href={inscripcion.href}
              target="_blank"
              rel="noopener noreferrer"
              data-event="inscripcion_torneo"
              data-label={t.titulo}
              className="btn btn-primary !min-h-11 !px-5 !py-2 text-sm"
            >
              <IconWhatsApp width={18} height={18} /> Inscribirme
            </a>
          ) : (
            !pasado && <span className="rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">Inscripciones próximamente</span>
          )}
          {t.slug && (
            <Link href={`/torneos/${t.slug}`} className="btn btn-ghost !min-h-11 !px-5 !py-2 text-sm text-brand">
              Ver detalles <IconArrow width={18} height={18} />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
