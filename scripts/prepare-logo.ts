/**
 * Prepara los recursos de marca a partir de los logos originales (carpeta assets-src/).
 * NO modifica el diseño del logo: solo quita el fondo blanco (transparencia) y recorta el margen.
 * También detecta los colores de la marca y genera favicon, ícono de app e imagen Open Graph.
 *
 * Uso: npm run assets:logo
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const src = (f: string) => path.join(root, 'assets-src', f)
const out = (...f: string[]) => path.join(root, ...f)

/** Quita el fondo blanco conservando el suavizado de bordes (des-premultiplica contra blanco). */
async function quitarFondoBlanco(input: string): Promise<Buffer> {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const REF_MIN = 25 // canal mínimo típico de los colores sólidos del logo (marino/lima)
  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2])
    const a = Math.min(1, Math.max(0, (255 - min) / (255 - REF_MIN)))
    if (a < 0.02) {
      data[i + 3] = 0
      continue
    }
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - 255 * (1 - a)) / a)))
    }
    data[i + 3] = Math.round(a * 255)
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer()
}

/** Color dominante entre píxeles opacos que cumplan el filtro. */
async function colorDominante(png: Buffer, filtro: (r: number, g: number, b: number) => boolean) {
  const { data } = await sharp(png).raw().toBuffer({ resolveWithObject: true })
  const cubos = new Map<string, { n: number; r: number; g: number; b: number }>()
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 250) continue
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
    if (!filtro(r, g, b)) continue
    const k = `${r >> 4}-${g >> 4}-${b >> 4}`
    const c = cubos.get(k) ?? { n: 0, r: 0, g: 0, b: 0 }
    c.n++
    c.r += r
    c.g += g
    c.b += b
    cubos.set(k, c)
  }
  const top = [...cubos.values()].sort((a, b) => b.n - a.n)[0]
  const h = (v: number) => Math.round(v / top.n).toString(16).padStart(2, '0')
  return `#${h(top.r)}${h(top.g)}${h(top.b)}`.toUpperCase()
}

async function main() {
  // 1) Logo completo y solo ícono, con fondo transparente y recortados.
  const logoFull = await sharp(await quitarFondoBlanco(src('logo-completo.jpg'))).trim().png().toBuffer()
  const logoIcon = await sharp(await quitarFondoBlanco(src('logo-icono.jpg'))).trim().png().toBuffer()

  // 2) Paleta real extraída del logo.
  const navy = await colorDominante(logoIcon, (r, g, b) => b > r + 20 && r < 60)
  const lime = await colorDominante(logoIcon, (r, g, b) => r > 170 && g > 190 && b < 100)
  console.log('Paleta detectada → marino:', navy, ' lima:', lime)

  // 3) Salidas: sitio web, seed y favicons (convención de Next: src/app/icon.png).
  const logoWeb = await sharp(logoFull).resize({ width: 900, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer()
  const iconWeb = await sharp(logoIcon).resize({ height: 512 }).png({ compressionLevel: 9 }).toBuffer()
  fs.writeFileSync(out('public', 'logo.png'), logoWeb)
  fs.writeFileSync(out('public', 'icon.png'), iconWeb)
  fs.writeFileSync(out('src', 'seed', 'assets', 'logo.png'), logoWeb)
  fs.writeFileSync(out('src', 'seed', 'assets', 'icono.png'), iconWeb)

  const square = (size: number, pad: number) =>
    sharp(logoIcon)
      .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  fs.writeFileSync(out('src', 'app', 'icon.png'), await square(512, 40))
  // Apple no admite transparencia: fondo blanco.
  fs.writeFileSync(
    out('src', 'app', 'apple-icon.png'),
    await sharp(await square(180, 14)).flatten({ background: '#ffffff' }).png().toBuffer(),
  )

  // 4) Imagen Open Graph por defecto 1200×630: logo sobre fondo claro con franja de acento.
  const logoOg = await sharp(logoFull).resize({ height: 470 }).png().toBuffer()
  const franja = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#F6F7F2"/><rect y="590" width="1200" height="40" fill="${lime}"/><rect y="0" width="1200" height="12" fill="${navy}"/></svg>`,
  )
  fs.writeFileSync(
    out('public', 'og-default.jpg'),
    await sharp(franja).composite([{ input: logoOg, gravity: 'center' }]).jpeg({ quality: 88 }).toBuffer(),
  )
  fs.writeFileSync(out('src', 'seed', 'assets', 'og-default.jpg'), fs.readFileSync(out('public', 'og-default.jpg')))

  // 5) Fotos para el seed: foto original del grupo + recortes (sin alterar la imagen).
  const grupo = src('grupo-clase.jpg')
  fs.copyFileSync(grupo, out('src', 'seed', 'assets', 'grupo-clase.jpg'))
  const crops: Array<[string, { left: number; top: number; width: number; height: number }]> = [
    ['galeria-2.jpg', { left: 0, top: 90, width: 700, height: 480 }],
    ['galeria-3.jpg', { left: 500, top: 150, width: 700, height: 480 }],
    ['galeria-4.jpg', { left: 250, top: 0, width: 700, height: 480 }],
  ]
  for (const [name, region] of crops) {
    fs.writeFileSync(
      out('src', 'seed', 'assets', name),
      await sharp(grupo).extract(region).jpeg({ quality: 90 }).toBuffer(),
    )
  }
  fs.writeFileSync(out('assets-src', 'paleta.json'), JSON.stringify({ marino: navy, lima: lime }, null, 2))
  console.log('Listo: public/logo.png, public/icon.png, src/app/icon.png, apple-icon.png, public/og-default.jpg')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
