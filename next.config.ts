import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/** Host del bucket público de R2 (si está configurado) para permitir next/image. */
const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  { protocol: 'http', hostname: 'localhost' },
  { protocol: 'http', hostname: '127.0.0.1' },
  { protocol: 'https', hostname: '**' },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    formats: ['image/avif', 'image/webp'],
    // Las imágenes locales de Payload llevan query string (?v=...)
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/**' }],
  },
  poweredByHeader: false,
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
