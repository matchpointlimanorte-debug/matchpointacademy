/** Convierte un texto en un slug seguro para URL ("Copa Match Point 2027" -> "copa-match-point-2027"). */
export function slugify(value: string): string {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
