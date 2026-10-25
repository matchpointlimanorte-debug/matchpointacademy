import { IconChevron } from '@/components/ui/Icons'
import { Section } from '@/components/ui/Section'
import type { SeccionConfig } from '@/lib/data'
import type { Pregunta } from '@/lib/types'

/** Acordeón con <details> nativo: accesible con teclado y sin JavaScript. */
export function Faq({ preguntas, cfg }: { preguntas: Pregunta[]; cfg: SeccionConfig }) {
  return (
    <Section id="faq" tone="sand" eyebrow="Dudas" titulo={cfg.titulo || 'Preguntas frecuentes'} subtitulo={cfg.subtitulo}>
      <div className="mx-auto max-w-3xl space-y-3">
        {preguntas.map((p) => (
          <details key={p.id} className="reveal card group overflow-hidden">
            <summary className="flex min-h-14 items-center justify-between gap-4 px-6 py-4 font-display text-lg font-bold text-brand">
              {p.pregunta}
              <IconChevron width={22} height={22} className="faq-chevron shrink-0 text-court" />
            </summary>
            <div className="border-t border-brand/10 px-6 py-4 text-ink/80">
              {p.respuesta.split(/\n\s*\n/).map((par, i) => (
                <p key={i} className={i ? 'mt-3' : ''}>
                  {par}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </Section>
  )
}
