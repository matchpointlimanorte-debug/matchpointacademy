import type { GlobalConfig } from 'payload'

import { isAdminOrEditor, publishedOrStaff } from '../access'
import { validarColor } from '../collections/shared'
import { revalidateGlobalAfterChange } from '../hooks/revalidate'

/**
 * Configuración del sitio: textos del inicio, quiénes somos, contacto,
 * redes, marca (logo y colores), SEO e integraciones.
 */
export const Configuracion: GlobalConfig = {
  slug: 'configuracion',
  label: 'Configuración del sitio',
  admin: {
    group: 'Sitio',
    description: 'Textos, teléfonos, redes, logo y colores de toda la web.',
    livePreview: { url: '/api/preview?path=/' },
  },
  access: {
    read: publishedOrStaff,
    update: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 1200 } }, max: 20 },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Inicio (portada)',
          fields: [
            { name: 'nombreSitio', label: 'Nombre de la academia', type: 'text', required: true, defaultValue: 'Match Point Lima Norte' },
            { name: 'heroEtiqueta', label: 'Etiqueta sobre el título', type: 'text', defaultValue: 'Academia de Tenis & Torneos' },
            { name: 'heroTitular', label: 'Título principal', type: 'text', required: true },
            { name: 'heroSubtitulo', label: 'Subtítulo', type: 'textarea', required: true },
            { name: 'heroCtaTexto', label: 'Texto del botón principal', type: 'text', required: true, defaultValue: 'Reserva tu clase de prueba' },
            { name: 'heroImagen', label: 'Foto de fondo', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Mejor si es horizontal y de buena calidad (mínimo 1600 px de ancho).' } },
            {
              name: 'heroVideo',
              label: 'Video de fondo (opcional)',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'video' } },
              admin: { description: 'MP4 corto (10–20 s), liviano (< 8 MB). Solo se muestra en computadoras; en celulares se usa la foto para que cargue rápido.' },
            },
          ],
        },
        {
          label: 'Quiénes somos',
          fields: [
            { name: 'quienesTitulo', label: 'Título', type: 'text', defaultValue: 'Quiénes somos' },
            { name: 'quienesTexto', label: 'Texto', type: 'textarea', required: true, admin: { description: 'Separa los párrafos con una línea en blanco.' } },
            { name: 'quienesImagen', label: 'Foto (opcional)', type: 'upload', relationTo: 'media' },
            {
              name: 'puntosClave',
              label: 'Puntos clave (3 recomendados)',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Punto', plural: 'Puntos clave' },
              fields: [
                { name: 'titulo', label: 'Título', type: 'text', required: true },
                { name: 'descripcion', label: 'Descripción corta', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Contacto y ubicación',
          fields: [
            {
              name: 'telefonos',
              label: 'Teléfonos',
              type: 'array',
              labels: { singular: 'Teléfono', plural: 'Teléfonos' },
              fields: [{ name: 'numero', label: 'Número (ej. 916 727 470)', type: 'text', required: true }],
            },
            { name: 'whatsappNumero', label: 'Número de WhatsApp (con código de país, solo dígitos)', type: 'text', required: true, defaultValue: '51916727470', admin: { description: 'Ej. 51916727470 (51 = Perú). Sin espacios ni signos.' } },
            { name: 'whatsappMensaje', label: 'Mensaje prellenado de WhatsApp', type: 'textarea', defaultValue: 'Hola Match Point Lima Norte, quiero reservar una clase de prueba.' },
            { name: 'email', label: 'Correo de contacto (opcional)', type: 'email' },
            { name: 'direccion', label: 'Dirección', type: 'text', required: true, defaultValue: 'Fuertes Hoyos, Rímac, Lima, Perú' },
            { name: 'referencia', label: 'Referencia de cómo llegar', type: 'textarea' },
            { name: 'mapaEmbedUrl', label: 'Enlace del mapa (opcional)', type: 'text', admin: { description: 'En Google Maps: Compartir > Insertar un mapa > copia solo la URL del atributo src. Si lo dejas vacío, se genera desde la dirección.' } },
            { name: 'mapaEnlace', label: 'Enlace "Cómo llegar" (opcional)', type: 'text' },
            { type: 'row', fields: [
              { name: 'latitud', label: 'Latitud (opcional)', type: 'number', admin: { width: '50%', description: 'Mejora el SEO local.' } },
              { name: 'longitud', label: 'Longitud (opcional)', type: 'number', admin: { width: '50%' } },
            ] },
          ],
        },
        {
          label: 'Redes sociales',
          fields: [
            { name: 'instagram', label: 'Instagram (enlace completo)', type: 'text', defaultValue: 'https://www.instagram.com/matchpointlimanorte' },
            { name: 'tiktok', label: 'TikTok (enlace completo)', type: 'text', defaultValue: 'https://www.tiktok.com/@matchpointlimanorte' },
            { name: 'facebook', label: 'Facebook (opcional)', type: 'text' },
            { name: 'youtube', label: 'YouTube (opcional)', type: 'text' },
          ],
        },
        {
          label: 'Marca (logo y colores)',
          fields: [
            { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media', admin: { description: 'PNG con fondo transparente.' } },
            { name: 'icono', label: 'Ícono (solo la pelota/pin)', type: 'upload', relationTo: 'media' },
            { name: 'colorPrimario', label: 'Color principal (azul marino)', type: 'text', defaultValue: '#0E2F55', validate: validarColor, admin: { description: 'Formato #RRGGBB. Se usa en títulos, fondos oscuros y botones secundarios.' } },
            { name: 'colorAcento', label: 'Color de acento (amarillo pelota)', type: 'text', defaultValue: '#DBDB11', validate: validarColor, admin: { description: 'Formato #RRGGBB. Se usa en el botón principal y detalles.' } },
          ],
        },
        {
          label: 'SEO y redes',
          fields: [
            {
              name: 'seoTitulo',
              label: 'Título para Google',
              type: 'text',
              defaultValue: 'Match Point Lima Norte | Academia y Clases de Tenis en Lima Norte y Rímac',
              admin: { description: 'Idealmente menos de 65 caracteres. Incluye palabras clave como "Academia de Tenis en Lima Norte".' },
            },
            {
              name: 'seoDescripcion',
              label: 'Descripción para Google',
              type: 'textarea',
              maxLength: 170,
              defaultValue:
                'Academia de tenis en Lima Norte (Fuertes Hoyos, Rímac). Clases para principiantes, intermedios y torneos en cancha de arcilla. ¡Reserva tu clase de prueba!',
              admin: { description: 'Idealmente entre 120 y 160 caracteres.' },
            },
            { name: 'ogImagen', label: 'Imagen al compartir en redes (1200×630)', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Formulario y analítica',
          fields: [
            { name: 'formularioActivo', label: 'Mostrar formulario de contacto', type: 'checkbox', defaultValue: false, admin: { description: 'Los mensajes llegan al correo configurado en el servidor y se guardan en "Mensajes de contacto".' } },
            { name: 'gaId', label: 'ID de Google Analytics (G-XXXXXXXXXX)', type: 'text', admin: { description: 'Opcional. También puede ir en la variable NEXT_PUBLIC_GA_ID.' } },
          ],
        },
      ],
    },
  ],
}
