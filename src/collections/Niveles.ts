import type { CollectionConfig, Field } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { livePreview, validarHora } from './shared'

const dias = [
  { label: 'Lunes', value: 'lunes' },
  { label: 'Martes', value: 'martes' },
  { label: 'Miércoles', value: 'miercoles' },
  { label: 'Jueves', value: 'jueves' },
  { label: 'Viernes', value: 'viernes' },
  { label: 'Sábado', value: 'sabado' },
  { label: 'Domingo', value: 'domingo' },
]

const horarioFields: Field[] = [
  { name: 'dia', label: 'Día', type: 'select', required: true, options: dias },
  {
    type: 'row',
    fields: [
      {
        name: 'horaInicio',
        label: 'Desde (24 h)',
        type: 'text',
        required: true,
        validate: validarHora,
        admin: { placeholder: '09:00', width: '50%' },
      },
      {
        name: 'horaFin',
        label: 'Hasta (24 h)',
        type: 'text',
        required: true,
        validate: validarHora,
        admin: { placeholder: '10:30', width: '50%' },
      },
    ],
  },
]

/** Niveles de clase con sus horarios (tarjetas de "Niveles y horarios"). */
export const Niveles: CollectionConfig = {
  slug: 'niveles',
  labels: { singular: 'Nivel / horario', plural: 'Niveles y horarios' },
  orderable: true,
  admin: {
    group: 'Contenido',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'edades', '_status'],
    description: 'Cada nivel es una tarjeta en la web. Arrastra para cambiar el orden.',
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
    { name: 'nombre', label: 'Nombre del nivel', type: 'text', required: true },
    { name: 'descripcion', label: 'Descripción corta', type: 'textarea' },
    { name: 'edades', label: 'Edades o público (opcional)', type: 'text' },
    {
      name: 'horarios',
      label: 'Horarios',
      type: 'array',
      labels: { singular: 'Horario', plural: 'Horarios' },
      minRows: 1,
      required: true,
      fields: horarioFields,
    },
    {
      name: 'cupoDisponible',
      label: 'Aviso de cupos (opcional)',
      type: 'text',
      admin: { description: 'Ej. "Pocos cupos". Se muestra como etiqueta en la tarjeta.' },
    },
    { name: 'destacado', label: 'Destacar esta tarjeta', type: 'checkbox', defaultValue: false },
  ],
}
