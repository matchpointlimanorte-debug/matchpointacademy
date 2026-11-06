import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

import { separarTorneos } from '@/components/sections/Torneos'
import { TorneoCard } from '@/components/sections/TorneoCard'
import { IconArrow, IconTrophy } from '@/components/ui/Icons'
import { getSiteData } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Torneos de Tenis y Competencias en Lima Norte',
  description:
    'Circuito de torneos de tenis en Match Point Lima Norte (Fuertes Hoyos, Rímac). Consulta fechas, categorías para principiantes e intermedios, inscripciones y resultados.',
  alternates: {
    canonical: '/torneos',
  },
  openGraph: {
    title: 'Torneos de Tenis y Competencias | Match Point Lima Norte',
    description:
      'Participa en nuestros torneos de tenis en cancha de arcilla para principiantes, intermedios y avanzados en Lima Norte.',
    url: `${SITE_URL}/torneos`,
  },
}

export default async function TorneosPage() {
  const { data } = await getSiteData()
  const { torneos, ajustes } = data
  const { proximos, pasados } = separarTorneos(torneos)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Torneos',
        item: `${SITE_URL}/torneos`,
      },
    ],
  }

  return (
    <div className="py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <nav aria-label="Miga de pan" className="mb-6 flex items-center gap-2 text-sm text-ink/60">
          <Link href="/" className="hover:text-brand">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-semibold text-brand">Torneos</span>
        </nav>

        <header className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Circuito Competitivo</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Torneos Match Point</h1>
          <p className="mt-4 text-lg text-ink/75">
            Participa en nuestros torneos internos y abiertos para todos los niveles: principiantes, intermedios y avanzados.
          </p>
        </header>

        {proximos.length > 0 && (
          <section aria-labelledby="proximos-heading" className="mb-16">
            <h2 id="proximos-heading" className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-brand">
                <IconTrophy width={20} height={20} />
              </span>
              Próximos torneos e inscripciones
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {proximos.map((t) => (
                <TorneoCard key={t.id} t={t} ajustes={ajustes} />
              ))}
            </div>
          </section>
        )}

        {pasados.length > 0 && (
          <section aria-labelledby="pasados-heading">
            <h2 id="pasados-heading" className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                <IconTrophy width={20} height={20} />
              </span>
              Resultados de torneos anteriores
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pasados.map((t) => (
                <TorneoCard key={t.id} t={t} ajustes={ajustes} pasado />
              ))}
            </div>
          </section>
        )}

        {proximos.length === 0 && pasados.length === 0 && (
          <div className="card p-12 text-center">
            <IconTrophy width={48} height={48} className="mx-auto text-court mb-4" />
            <h2 className="text-2xl font-bold">Próximamente nuevo calendario de torneos</h2>
            <p className="mt-2 text-ink/70">
              Estamos preparando las próximas fechas. Síguenos en redes o escríbenos para mantenerte al tanto.
            </p>
            <div className="mt-6">
              <Link href="/" className="btn btn-dark">
                Volver al inicio <IconArrow width={18} height={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
