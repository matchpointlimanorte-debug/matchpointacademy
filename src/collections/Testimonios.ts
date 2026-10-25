import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { livePreview } from './shared'

/** Testimonios de alumnos y familias. */
export const Testimonios: CollectionConfig = {
  slug: 'testimonios',
  labels: { singular: 'Testimonio', plural: 'Testimonios' },
  orderable: true,
  admin: {
    group: 'Contenido',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'detalle', '_status'],
    description: 'La sección se oculta sola si no hay testimonios publicados.',
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
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'detalle', label: 'Detalle (ej. "Mamá de alumno", "Alumno desde 2025")', type: 'text' },
    { name: 'texto', label: 'Testimonio', type: 'textarea', required: true, maxLength: 500 },
    { name: 'estrellas', label: 'Estrellas (1 a 5)', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'foto', label: 'Foto (opcional)', type: 'upload', relationTo: 'media' },
  ],
}
