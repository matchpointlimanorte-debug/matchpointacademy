import { Section } from '@/components/ui/Section'
import { IconClock, IconWhatsApp } from '@/components/ui/Icons'
import type { SeccionConfig } from '@/lib/data'
import { nombreDia, rangoHoras, whatsappUrl } from '@/lib/site'
import type { Ajustes, Nivel } from '@/lib/types'

const ORDEN_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

export function Niveles({ niveles, ajustes, cfg }: { niveles: Nivel[]; ajustes: Ajustes; cfg: SeccionConfig }) {
  return (
    <Section
      id="niveles"
      tone="light"
      eyebrow="Clases"
      titulo={cfg.titulo || 'Niveles y horarios'}
      subtitulo={cfg.subtitulo || 'Elige el nivel que va contigo. Si dudas, reserva una clase de prueba y te orientamos.'}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {niveles.map((n) => {
          const horarios = [...(n.horarios || [])].sort(
            (a, b) => ORDEN_DIAS.indexOf(a.dia) - ORDEN_DIAS.indexOf(b.dia) || a.horaInicio.localeCompare(b.horaInicio),
          )
          return (
            <article
              key={n.id}
              className={`reveal card card-hover relative flex flex-col overflow-hidden p-7 ${
                n.destacado ? 'ring-2 ring-accent' : ''
              }`}
            >
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-accent" />
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-extrabold">{n.nombre}</h3>
                {n.cupoDisponible && (
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand">
                    {n.cupoDisponible}
                  </span>
                )}
              </div>
              {n.edades && <p className="mt-1 text-sm font-semibold text-court">{n.edades}</p>}
              {n.descripcion && <p className="mt-3 text-ink/75">{n.descripcion}</p>}

              <ul className="mt-5 space-y-2.5">
                {horarios.map((h) => (
                  <li key={h.id || `${h.dia}-${h.horaInicio}`} className="flex items-center gap-3 rounded-xl bg-brand-soft px-4 py-3">
                    <IconClock width={20} height={20} className="shrink-0 text-court" />
                    <span>
                      <strong className="font-display text-brand">{nombreDia(h.dia)}</strong>{' '}
                      <span className="text-ink/80">{rangoHoras(h.horaInicio, h.horaFin)}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={whatsappUrl(ajustes, `Hola, quiero reservar una clase de prueba de nivel ${n.nombre}.`)}
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                data-label={`nivel_${n.nombre}`}
                className="btn btn-dark mt-auto !mt-7 w-full"
              >
                <IconWhatsApp width={20} height={20} /> Reservar este nivel
              </a>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
