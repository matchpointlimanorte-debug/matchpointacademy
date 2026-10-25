import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminUser } from '../access'

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Usuarios del panel. Roles:
 * - admin  (director): todo, incluida la gestión de usuarios.
 * - editor: edita contenido; no gestiona usuarios.
 *
 * El primer usuario que se registra queda como Admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'email', 'rol'],
    group: 'Administración',
    description: 'Personas que pueden entrar al panel de administración.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // sesión de 7 días
    maxLoginAttempts: 5, // protección contra fuerza bruta
    lockTime: 15 * 60 * 1000, // bloqueo de 15 minutos
    forgotPassword: {
      expiration: 60 * 60 * 1000, // enlace válido 1 hora
      generateEmailSubject: () => 'Recupera tu contraseña — Match Point Lima Norte',
      generateEmailHTML: (args) => {
        const token = args?.token ?? ''
        const nombre = (args?.user as { nombre?: string } | undefined)?.nombre ?? ''
        const url = `${siteUrl()}/admin/reset/${token}`
        return `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#0f2a4a">
            <h2 style="color:#0f2a4a">Hola${nombre ? ` ${nombre}` : ''} 👋</h2>
            <p>Recibimos una solicitud para cambiar tu contraseña del panel de
            <strong>Match Point Lima Norte</strong>.</p>
            <p><a href="${url}" style="display:inline-block;background:#d6e01f;color:#0f2a4a;
              padding:12px 22px;border-radius:999px;font-weight:bold;text-decoration:none">
              Crear nueva contraseña</a></p>
            <p style="font-size:13px;color:#555">El enlace vence en 1 hora. Si no fuiste tú, ignora este correo.</p>
          </div>`
      },
    },
  },
  access: {
    // Solo el Admin crea y borra usuarios. (El primer registro lo permite Payload.)
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      if (isAdminUser(req.user as { rol?: 'admin' | 'editor' })) return true
      // Un Editor solo se ve a sí mismo.
      return req.user ? { id: { equals: req.user.id } } : false
    },
    update: ({ req }) => {
      if (isAdminUser(req.user as { rol?: 'admin' | 'editor' })) return true
      return req.user ? { id: { equals: req.user.id } } : false
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        // El primer usuario del sistema siempre es Admin.
        if (operation === 'create' && data) {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.rol = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    {
      name: 'rol',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Administrador (director)', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Un editor no puede subirse el rol a sí mismo.
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        description: 'El Editor puede cambiar contenidos, pero no puede crear usuarios.',
      },
    },
  ],
}
