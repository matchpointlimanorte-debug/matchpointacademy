import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Entrenadores } from './collections/Entrenadores'
import { Faq } from './collections/Faq'
import { Galeria } from './collections/Galeria'
import { Media } from './collections/Media'
import { Mensajes } from './collections/Mensajes'
import { Niveles } from './collections/Niveles'
import { Planes } from './collections/Planes'
import { Testimonios } from './collections/Testimonios'
import { Torneos } from './collections/Torneos'
import { Users } from './collections/Users'
import { Configuracion } from './globals/Configuracion'
import { Landing } from './globals/Landing'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProd = process.env.NODE_ENV === 'production'

/** Normaliza un origen eliminando barras finales y asegurando protocolo https:// si falta */
const normalizeOrigin = (url?: string | null): string | null => {
  if (!url) return null
  let trimmed = url.trim().replace(/\/+$/, '')
  if (!trimmed) return null
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`
  }
  return trimmed
}

// Dominios detectados automáticamente del entorno de Railway o Vercel
const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN
const railwayStaticUrl = process.env.RAILWAY_STATIC_URL
const autoDetectedOrigins = [
  railwayPublicDomain ? `https://${railwayPublicDomain}` : null,
  railwayStaticUrl ? `https://${railwayStaticUrl}` : null,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null,
].filter(Boolean) as string[]

const configuredSiteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)
const siteUrl = configuredSiteUrl || autoDetectedOrigins[0] || (isProd ? '' : 'http://localhost:3000')

const customOrigins = (process.env.PAYLOAD_TRUSTED_ORIGINS || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean) as string[]

// Lista consolidada de orígenes confiables para CORS y CSRF
const trustedOrigins: string[] = Array.from(
  new Set(
    [
      siteUrl,
      configuredSiteUrl,
      ...autoDetectedOrigins,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      ...customOrigins,
    ].filter(Boolean) as string[],
  ),
)

// Si se deshabilita explícitamente o si en producción no se ha configurado aún ningún dominio,
// dejamos csrf en [] para que Payload acepte las cookies del navegador (protegidas por SameSite)
const disableCsrf = process.env.PAYLOAD_DISABLE_CSRF === 'true'
const csrfOrigins = disableCsrf || (!configuredSiteUrl && autoDetectedOrigins.length === 0)
  ? []
  : trustedOrigins

/** ¿Hay un bucket S3/R2 configurado? Si no, las imágenes se guardan en disco (solo desarrollo). */
const hasS3 = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

import { migrations } from './migrations'

export default buildConfig({
  serverURL: siteUrl,
  // Orígenes permitidos para cookies/CSRF y peticiones autenticadas
  cors: trustedOrigins.length > 0 ? trustedOrigins : '*',
  csrf: csrfOrigins,

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Match Point Lima Norte',
      description: 'Panel de administración de Match Point Lima Norte',
      icons: [{ rel: 'icon', url: '/icon.png' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Logo#Icon',
      },
    },
  },

  // Panel en español.
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },

  collections: [Niveles, Entrenadores, Galeria, Torneos, Testimonios, Planes, Faq, Media, Mensajes, Users],
  globals: [Configuracion, Landing],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Sincroniza automáticamente las tablas en Postgres (crea tablas e índices que no existan).
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),

  // Correo: con RESEND_API_KEY se envía de verdad; sin ella, se imprime en consola.
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          defaultFromName: process.env.EMAIL_FROM_NAME || 'Match Point Lima Norte',
        }),
      }
    : {}),

  sharp,

  plugins: [
    // Almacenamiento Cloudflare R2 (S3 compatible): se activa si hay credenciales (producción), o guarda en disco si enabled: false (local).
    s3Storage({
      enabled: hasS3,
      collections: {
        media: {
          generateFileURL: ({ filename, prefix }) =>
            [process.env.S3_PUBLIC_URL, prefix, filename].filter(Boolean).join('/'),
        },
      },
      bucket: process.env.S3_BUCKET || 'placeholder-bucket',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || 'placeholder-key',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'placeholder-secret',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT || 'https://auto.r2.cloudflarestorage.com',
        forcePathStyle: true,
      },
    }),
  ],
})
