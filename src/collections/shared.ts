/** Piezas reutilizables entre colecciones. */

/** Vista previa en vivo: el iframe del admin abre la home en modo borrador. */
export const livePreview = { url: '/api/preview?path=/' }

/** Valida una hora 24 h con formato H:MM o HH:MM. */
export const validarHora = (value?: string | null): true | string => {
  if (!value) return 'Escribe la hora (ej. 09:00).'
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(value.trim())
    ? true
    : 'Formato inválido. Usa 24 horas, por ejemplo 09:00 o 14:30.'
}

/** Valida un color hexadecimal (#RRGGBB). */
export const validarColor = (value?: string | null): true | string => {
  if (!value) return true
  return /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? true : 'Usa el formato #RRGGBB, por ejemplo #0F2A4A.'
}
