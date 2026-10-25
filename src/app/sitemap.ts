import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rutas: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/torneos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    const payload = await getPayloadClient()
    const torneos = await payload.find({
      collection: 'torneos',
      where: { _status: { equals: 'published' } },
      limit: 100,
      pagination: false,
    })

    for (const t of torneos.docs) {
      if (t.slug) {
        rutas.push({
          url: `${SITE_URL}/torneos/${t.slug}`,
          lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch {
    // Si la BD aún no está disponible durante el build estático inicial
  }

  return rutas
}
