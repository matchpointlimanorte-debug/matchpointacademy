import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { livePreview } from './shared'

/** Equipo de entrenadores (foto, nombre, bio breve). */
export const Entrenadores: CollectionConfig = {
  slug: 'entrenadores',
  labels: { singular: 'Entrenador', plural: 'Entrenadores' },
  orderable: true,
  admin: {
    group: 'Contenido',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'cargo', '_status'],
    description: 'Arrastra para cambiar el orden. La sección se oculta sola si no hay entrenadores.',
    livePreview,
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 1200 } }, maxPerDoc: 10 },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
    { name: 'cargo', label: 'Cargo (ej. Entrenador principal)', type: 'text' },
    { name: 'foto', label: 'Foto', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'bio',
      label: 'Biografía breve',
      type: 'textarea',
      maxLength: 400,
      admin: { description: 'Máximo 400 caracteres.' },
    },
    { name: 'certificaciones', label: 'Certificaciones o logros (opcional)', type: 'text' },
  ],
}
