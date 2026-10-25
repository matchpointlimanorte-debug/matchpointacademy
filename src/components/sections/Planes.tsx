import { IconCheck, IconWhatsApp } from '@/components/ui/Icons'
import { Section } from '@/components/ui/Section'
import type { SeccionConfig } from '@/lib/data'
import { whatsappUrl } from '@/lib/site'
import type { Ajustes, Plan } from '@/lib/types'

export function Planes({ planes, ajustes, cfg }: { planes: Plan[]; ajustes: Ajustes; cfg: SeccionConfig }) {
  return (
    <Section id="planes" tone="sand" eyebrow="Precios" titulo={cfg.titulo || 'Planes y precios'} subtitulo={cfg.subtitulo} center>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {planes.map((p) => (
          <article
            key={p.id}
            className={`reveal card relative flex flex-col p-7 ${p.destacado ? 'bg-brand text-white ring-4 ring-accent md:-translate-y-3' : ''}`}
          >
            {p.destacado && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-brand">
                Más popular
              </span>
            )}
            <h3 className={`text-xl font-extrabold ${p.destacado ? '!text-white' : ''}`}>{p.nombre}</h3>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className={`font-display text-4xl font-extrabold ${p.destacado ? 'text-accent' : 'text-brand'}`}>{p.precio}</span>
              {p.periodo && <span className={p.destacado ? 'text-white/70' : 'text-ink/60'}>{p.periodo}</span>}
            </p>
            {p.descripcion && <p className={`mt-3 ${p.destacado ? 'text-white/80' : 'text-ink/75'}`}>{p.descripcion}</p>}
            <ul className="mt-5 space-y-2.5">
              {(p.caracteristicas || []).map((c) => (
                <li key={c.id || c.texto} className="flex items-start gap-2.5">
                  <IconCheck width={20} height={20} className={`mt-0.5 shrink-0 ${p.destacado ? 'text-accent' : 'text-court'}`} />
                  <span>{c.texto}</span>
                </li>
              ))}
            </ul>
            <a
              href={whatsappUrl(ajustes, `Hola, me interesa el plan "${p.nombre}".`)}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp_click"
              data-label={`plan_${p.nombre}`}
              className={`btn mt-auto !mt-7 ${p.destacado ? 'btn-primary' : 'btn-dark'}`}
            >
              <IconWhatsApp width={20} height={20} /> {p.ctaTexto || 'Quiero este plan'}
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}
