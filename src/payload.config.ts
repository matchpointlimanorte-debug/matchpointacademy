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
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/** ¿Hay un bucket S3/R2 configurado? Si no, las imágenes se guardan en disco (solo desarrollo). */
const hasS3 = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

export default buildConfig({
  serverURL: siteUrl,
  // Orígenes permitidos para cookies/CSRF. Al conectar el dominio propio, solo cambia NEXT_PUBLIC_SITE_URL.
  cors: [siteUrl],
  csrf: [siteUrl],

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
    // Imágenes en Cloudflare R2 (S3 compatible). Solo se activa si hay credenciales.
    ...(hasS3
      ? [
          s3Storage({
            collections: {
              media: {
                // Las URLs públicas apuntan directo al bucket (CDN de R2).
                generateFileURL: ({ filename, prefix }) =>
                  [process.env.S3_PUBLIC_URL, prefix, filename].filter(Boolean).join('/'),
              },
            },
            bucket: process.env.S3_BUCKET as string,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
              },
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
})
