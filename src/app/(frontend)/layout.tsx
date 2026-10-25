import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import React from 'react'

export const dynamic = 'force-dynamic'

import { Analytics } from '@/components/Analytics'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { PreviewRefresh } from '@/components/PreviewRefresh'
import { WhatsAppFab } from '@/components/WhatsAppFab'
import { getSiteData } from '@/lib/data'
import { SITE_URL, medio, urlMedio } from '@/lib/site'
import './styles.css'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  themeColor: '#0E2F55',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getSiteData()
  const { ajustes } = data
  const ogImg = urlMedio(medio(ajustes.ogImagen) || medio(ajustes.heroImagen), 'hero')
  const ogUrl = ogImg ? (ogImg.startsWith('http') ? ogImg : `${SITE_URL}${ogImg}`) : `${SITE_URL}/og-default.jpg`

  const titulo = ajustes.seoTitulo || `${ajustes.nombreSitio || 'Match Point Lima Norte'} | Academia de Tenis & Torneos`
  const descripcion =
    ajustes.seoDescripcion ||
    ajustes.heroSubtitulo ||
    'Academia de tenis en Lima Norte: clases para principiantes, intermedios y torneos. Reserva tu clase de prueba.'

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titulo,
      template: `%s | ${ajustes.nombreSitio || 'Match Point Lima Norte'}`,
    },
    description: descripcion,
    applicationName: ajustes.nombreSitio || 'Match Point Lima Norte',
    authors: [{ name: ajustes.nombreSitio || 'Match Point Lima Norte' }],
    keywords: [
      'tenis lima norte',
      'academia de tenis lima',
      'clases de tenis rimac',
      'torneos de tenis lima',
      'match point lima norte',
      'tenis principiantes lima',
    ],
    creator: 'Match Point Lima Norte',
    publisher: 'Match Point Lima Norte',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: SITE_URL,
      siteName: ajustes.nombreSitio || 'Match Point Lima Norte',
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: ajustes.nombreSitio || 'Match Point Lima Norte',
        },
      ],
      locale: 'es_PE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
      images: [ogUrl],
    },
    icons: {
      icon: [
        { url: '/icon.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { data, preview } = await getSiteData()
  const { ajustes, niveles, secciones } = data

  const brand = ajustes.colorPrimario || '#0E2F55'
  const accent = ajustes.colorAcento || '#DBDB11'

  const customStyles = {
    '--brand': brand,
    '--accent': accent,
  } as React.CSSProperties

  return (
    <html lang="es-PE" className={`${outfit.variable} ${inter.variable}`} style={customStyles}>
      <head>
        <JsonLd ajustes={ajustes} niveles={niveles} />
      </head>
      <body className="min-h-screen bg-sand text-ink antialiased">
        <a href="#contenido" className="sr-only-focusable bg-accent px-4 py-2 text-brand font-bold z-50">
          Saltar al contenido principal
        </a>
        <Header ajustes={ajustes} secciones={secciones} hayTorneoPagina={true} />
        <div id="contenido">{children}</div>
        <Footer ajustes={ajustes} secciones={secciones} />
        <WhatsAppFab ajustes={ajustes} />
        <Analytics gaId={ajustes.gaId || process.env.NEXT_PUBLIC_GA_ID} />
        {preview && <PreviewRefresh />}
      </body>
    </html>
  )
}
