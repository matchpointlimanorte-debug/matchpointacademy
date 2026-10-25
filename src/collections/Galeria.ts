import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/** Fotos de la galería. Sin borradores: lo que se guarda se publica. */
export const Galeria: CollectionConfig = {
  slug: 'galeria',
  labels: { singular: 'Foto de galería', plural: 'Galería' },
  orderable: true,
  admin: {
    group: 'Contenido',
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'categoria', 'imagen'],
    description: 'Arrastra para cambiar el orden de las fotos.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'imagen', label: 'Foto', type: 'upload', relationTo: 'media', required: true },
    { name: 'titulo', label: 'Título corto', type: 'text', required: true },
    {
      name: 'categoria',
      label: 'Categoría',
      type: 'select',
      defaultValue: 'clases',
      options: [
        { label: 'Clases', value: 'clases' },
        { label: 'Torneos', value: 'torneos' },
        { label: 'Instalaciones', value: 'instalaciones' },
        { label: 'Comunidad', value: 'comunidad' },
      ],
    },
  ],
}
