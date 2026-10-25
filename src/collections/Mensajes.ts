import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '../access'

/**
 * Mensajes recibidos desde el formulario de contacto.
 * Solo se crean desde la API pública (/api/contacto, con overrideAccess).
 */
export const Mensajes: CollectionConfig = {
  slug: 'mensajes',
  labels: { singular: 'Mensaje de contacto', plural: 'Mensajes de contacto' },
  defaultSort: '-createdAt',
  admin: {
    group: 'Administración',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'telefono', 'email', 'createdAt'],
    description: 'Mensajes enviados desde el formulario de contacto de la web (también llegan por correo).',
  },
  access: {
    create: () => false,
    read: isAdminOrEditor,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { name: 'email', label: 'Correo', type: 'email' },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true },
  ],
}
