import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/** Etiqueta única de caché para todo el contenido público del sitio. */
export const SITE_CACHE_TAG = 'site'

/**
 * Invalida la caché de la web pública.
 * Se ejecuta tras publicar/editar/borrar contenido en el admin.
 * Se protege con try/catch porque los scripts (seed, migraciones)
 * corren fuera de Next.js y no tienen contexto de caché.
 */
export function revalidateSite(): void {
  try {
    revalidateTag(SITE_CACHE_TAG, 'default')
    revalidatePath('/', 'layout')
  } catch {
    // Sin contexto de Next (p. ej. `npm run seed`): no hay nada que invalidar.
  }
}

/** No invalida al guardar borradores (solo cuando hay contenido publicado). */
export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  if (doc?._status !== 'draft') revalidateSite()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc }) => {
  if (doc?._status !== 'draft') revalidateSite()
  return doc
}
