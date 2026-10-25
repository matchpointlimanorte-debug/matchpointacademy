import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { slugify } from '../lib/slugify'
import { livePreview } from './shared'

/** Torneos: próximos y resultados pasados. */
export const Torneos: CollectionConfig = {
  slug: 'torneos',
  labels: { singular: 'Torneo', plural: 'Torneos' },
  defaultSort: '-fechaInicio',
  admin: {
    group: 'Contenido',
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'fechaInicio', 'estado', '_status'],
    description:
      'Crea un torneo, complétalo y pulsa "Publicar". Puedes guardar borradores y ver la vista previa antes de publicar.',
    livePreview,
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 1200 } }, maxPerDoc: 15 },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // El slug se crea solo a partir del título si está vacío.
        if (data && !data.slug && data.titulo) data.slug = slugify(data.titulo)
        return data
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'titulo', label: 'Nombre del torneo', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Dirección web (se crea sola)',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Se genera automáticamente a partir del nombre.' },
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      required: true,
      defaultValue: 'proximo',
      admin: {
        position: 'sidebar',
        description: 'Si la fecha ya pasó, el torneo se mueve solo a "Resultados".',
      },
      options: [
        { label: 'Próximo', value: 'proximo' },
        { label: 'Finalizado (mostrar en resultados)', value: 'finalizado' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'fechaInicio', label: 'Fecha de inicio', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
        { name: 'fechaFin', label: 'Fecha de fin (opcional)', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
      ],
    },
    {
      name: 'fechaTexto',
      label: 'Texto de fecha (si aún no hay fecha exacta)',
      type: 'text',
      admin: { description: 'Ej. "Próximamente" o "Segundo semestre 2027". Se usa solo cuando no hay fecha de inicio.' },
    },
    { name: 'categoria', label: 'Categoría', type: 'text', admin: { description: 'Ej. "Principiantes e Intermedios", "Sub-12", "Libre".' } },
    { name: 'lugar', label: 'Lugar', type: 'text' },
    { name: 'resumen', label: 'Resumen corto (para la tarjeta)', type: 'textarea', maxLength: 240 },
    { name: 'descripcion', label: 'Descripción completa', type: 'richText' },
    { name: 'afiche', label: 'Afiche o imagen', type: 'upload', relationTo: 'media' },
    { name: 'costo', label: 'Costo de inscripción (opcional)', type: 'text', admin: { description: 'Ej. "S/ 40 por jugador".' } },
    {
      type: 'collapsible',
      label: 'Inscripción',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'inscripcionTipo',
          label: 'Cómo se inscriben',
          type: 'select',
          defaultValue: 'whatsapp',
          options: [
            { label: 'Por WhatsApp (mensaje prellenado)', value: 'whatsapp' },
            { label: 'Enlace externo (formulario, etc.)', value: 'enlace' },
            { label: 'Inscripciones cerradas / aún no abiertas', value: 'cerrada' },
          ],
        },
        {
          name: 'inscripcionUrl',
          label: 'Enlace de inscripción',
          type: 'text',
          admin: { condition: (_, s) => s?.inscripcionTipo === 'enlace' },
        },
        {
          name: 'mensajeWhatsApp',
          label: 'Mensaje de WhatsApp (opcional)',
          type: 'textarea',
          admin: {
            condition: (_, s) => s?.inscripcionTipo === 'whatsapp',
            description: 'Si lo dejas vacío se usa: "Hola, quiero inscribirme en <nombre del torneo>".',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Resultados (para torneos finalizados)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'resultados',
          label: 'Resultados por categoría',
          type: 'array',
          labels: { singular: 'Resultado', plural: 'Resultados' },
          fields: [
            { name: 'categoria', label: 'Categoría', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'campeon', label: 'Campeón/a', type: 'text', admin: { width: '33%' } },
                { name: 'subcampeon', label: 'Subcampeón/a', type: 'text', admin: { width: '33%' } },
                { name: 'tercero', label: 'Tercer lugar', type: 'text', admin: { width: '33%' } },
              ],
            },
          ],
        },
        {
          name: 'fotos',
          label: 'Fotos del torneo',
          type: 'array',
          labels: { singular: 'Foto', plural: 'Fotos' },
          fields: [{ name: 'imagen', label: 'Foto', type: 'upload', relationTo: 'media', required: true }],
        },
      ],
    },
  ],
}
