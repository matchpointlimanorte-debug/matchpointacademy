import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/**
 * Biblioteca de medios (fotos y video del hero).
 * Los archivos van a Cloudflare R2 cuando hay variables S3_* (ver payload.config.ts).
 * `alt` es obligatorio por accesibilidad.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Archivo', plural: 'Archivos (fotos y videos)' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'createdAt'],
    description: 'Fotos y videos. Escribe siempre una descripción corta (texto alternativo).',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    adminThumbnail: 'thumb',
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 72 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Descripción de la imagen (texto alternativo)',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe qué se ve (ej. "Alumnos con raquetas en la cancha de arcilla"). Ayuda a personas con discapacidad visual y a Google.',
      },
    },
    { name: 'credito', label: 'Crédito (opcional)', type: 'text' },
  ],
}
