import type { Access, FieldAccess } from 'payload'

/** Roles disponibles en el panel. */
export type Rol = 'admin' | 'editor'

type UserLike = { rol?: Rol | null } | null | undefined

export const isAdminUser = (user: UserLike): boolean => user?.rol === 'admin'
export const isStaffUser = (user: UserLike): boolean =>
  user?.rol === 'admin' || user?.rol === 'editor'

/** Solo el director (Admin). */
export const isAdmin: Access = ({ req }) => isAdminUser(req.user as UserLike)

/** Admin o Editor (cualquier persona con sesión iniciada). */
export const isAdminOrEditor: Access = ({ req }) => isStaffUser(req.user as UserLike)

/** Campo editable solo por Admin. */
export const isAdminField: FieldAccess = ({ req }) => isAdminUser(req.user as UserLike)

/**
 * Lectura pública de contenido con borradores:
 * - Visitantes: solo lo publicado.
 * - Personal del panel: todo (incluye borradores, necesario para la vista previa).
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaffUser(req.user as UserLike)) return true
  return { _status: { equals: 'published' } }
}

/** Lectura pública sin borradores (colecciones simples). */
export const anyone: Access = () => true
