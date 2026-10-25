import type { ReactNode } from 'react'

type Tone = 'light' | 'sand' | 'dark'

const tones: Record<Tone, string> = {
  light: 'bg-white',
  sand: 'bg-sand',
  dark: 'bg-brand text-white on-dark',
}

/** Contenedor estándar de sección con encabezado (etiqueta, h2 y subtítulo). */
export function Section({
  id,
  tone = 'sand',
  eyebrow,
  titulo,
  subtitulo,
  children,
  center = false,
}: {
  id: string
  tone?: Tone
  eyebrow?: string
  titulo: string
  subtitulo?: string | null
  children: ReactNode
  center?: boolean
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className={`${tones[tone]} py-16 md:py-24`}>
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <header className={`reveal mb-10 md:mb-14 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2
            id={`${id}-titulo`}
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold ${tone === 'dark' ? '!text-white' : ''}`}
          >
            {titulo}
          </h2>
          {subtitulo && (
            <p className={`mt-4 text-lg ${tone === 'dark' ? 'text-white/80' : 'text-ink/75'}`}>{subtitulo}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}
