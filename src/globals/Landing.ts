import type { GlobalConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { revalidateGlobalAfterChange } from '../hooks/revalidate'

/** Secciones disponibles en la landing, en su orden por defecto. */
export const SECCIONES = [
  { value: 'hero', label: 'Portada (hero)', defaultVisible: true, menu: '' },
  { value: 'quienes', label: 'Quiénes somos', defaultVisible: true, menu: 'Nosotros' },
  { value: 'niveles', label: 'Niveles y horarios', defaultVisible: true, menu: 'Horarios' },
  { value: 'entrenadores', label: 'Entrenadores', defaultVisible: true, menu: 'Entrenadores' },
  { value: 'galeria', label: 'Galería de fotos', defaultVisible: true, menu: 'Galería' },
  { value: 'torneos', label: 'Torneos', defaultVisible: true, menu: 'Torneos' },
  { value: 'planes', label: 'Planes y precios', defaultVisible: false, menu: 'Planes' },
  { value: 'testimonios', label: 'Testimonios', defaultVisible: true, menu: 'Testimonios' },
  { value: 'faq', label: 'Preguntas frecuentes', defaultVisible: true, menu: 'Preguntas' },
  { value: 'ubicacion', label: 'Ubicación y contacto', defaultVisible: true, menu: 'Ubicación' },
] as const

export type SeccionTipo = (typeof SECCIONES)[number]['value']

/** Valores iniciales (se usan como `defaultValue` y en el seed). */
export const SECCIONES_POR_DEFECTO = SECCIONES.map((s) => ({
  tipo: s.value,
  visible: s.defaultVisible,
  etiquetaMenu: s.menu,
}))

/**
 * Orden y visibilidad de las secciones de la landing.
 * El director arrastra las filas para reordenar y desmarca "Mostrar" para ocultar.
 */
export const Landing: GlobalConfig = {
  slug: 'landing',
  label: 'Orden y visibilidad de secciones',
  admin: {
    group: 'Sitio',
    description:
      'Arrastra las filas para cambiar el orden de la página principal y desmarca "Mostrar" para ocultar una sección. No es necesario agregar ni borrar filas.',
    livePreview: { url: '/api/preview?path=/' },
  },
  access: {
    read: publishedOrStaff,
    update: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 1200 } }, max: 20 },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
    beforeValidate: [
      ({ data }) => {
        // Garantiza que estén todas las secciones, sin duplicados y la portada siempre primera.
        if (!data) return data
        const actuales = Array.isArray(data.secciones) ? data.secciones : []
        const vistos = new Set<string>()
        const limpias = actuales.filter((s: { tipo?: string }) => {
          if (!s?.tipo || vistos.has(s.tipo)) return false
          vistos.add(s.tipo)
          return true
        })
        for (const def of SECCIONES_POR_DEFECTO) {
          if (!vistos.has(def.tipo)) limpias.push({ ...def })
        }
        const hero = limpias.findIndex((s: { tipo: string }) => s.tipo === 'hero')
        if (hero > 0) limpias.unshift(limpias.splice(hero, 1)[0])
        data.secciones = limpias
        return data
      },
    ],
  },
  fields: [
    {
      name: 'secciones',
      label: 'Secciones de la página principal',
      type: 'array',
      labels: { singular: 'Sección', plural: 'Secciones' },
      defaultValue: SECCIONES_POR_DEFECTO,
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'tipo',
              label: 'Sección',
              type: 'select',
              required: true,
              options: SECCIONES.map((s) => ({ label: s.label, value: s.value })),
              admin: { width: '45%' },
            },
            { name: 'visible', label: 'Mostrar', type: 'checkbox', defaultValue: true, admin: { width: '15%' } },
            { name: 'etiquetaMenu', label: 'Texto en el menú', type: 'text', admin: { width: '40%', description: 'Vacío = no aparece en el menú.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'titulo', label: 'Título de la sección (opcional)', type: 'text', admin: { width: '50%' } },
            { name: 'subtitulo', label: 'Subtítulo (opcional)', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
