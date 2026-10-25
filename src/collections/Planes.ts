import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { livePreview } from './shared'

/**
 * Planes y precios.
 * La sección completa está OCULTA por defecto: se activa en
 * "Configuración > Orden y visibilidad de secciones" (global Landing).
 */
export const Planes: CollectionConfig = {
  slug: 'planes',
  labels: { singular: 'Plan', plural: 'Planes y precios' },
  orderable: true,
  admin: {
    group: 'Contenido',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'precio', 'periodo', '_status'],
    description:
      'Crea aquí tus planes. Para mostrarlos en la web, activa la sección "Planes y precios" en "Orden y visibilidad de secciones".',
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
    { name: 'nombre', label: 'Nombre del plan', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'precio', label: 'Precio (ej. S/ 120)', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'periodo', label: 'Periodo (ej. al mes, por clase)', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'descripcion', label: 'Descripción corta', type: 'textarea' },
    {
      name: 'caracteristicas',
      label: 'Qué incluye',
      type: 'array',
      labels: { singular: 'Característica', plural: 'Características' },
      fields: [{ name: 'texto', label: 'Texto', type: 'text', required: true }],
    },
    { name: 'destacado', label: 'Plan destacado ("Más popular")', type: 'checkbox', defaultValue: false },
    { name: 'ctaTexto', label: 'Texto del botón', type: 'text', defaultValue: 'Quiero este plan' },
  ],
}
