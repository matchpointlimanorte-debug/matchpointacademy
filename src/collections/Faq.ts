import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { livePreview } from './shared'

/** Preguntas frecuentes. */
export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Pregunta frecuente', plural: 'Preguntas frecuentes' },
  orderable: true,
  admin: {
    group: 'Contenido',
    useAsTitle: 'pregunta',
    defaultColumns: ['pregunta', '_status'],
    description: 'Arrastra para cambiar el orden.',
    livePreview,
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 1200 } }, maxPerDoc: 5 },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'pregunta', label: 'Pregunta', type: 'text', required: true },
    { name: 'respuesta', label: 'Respuesta', type: 'textarea', required: true },
  ],
}
