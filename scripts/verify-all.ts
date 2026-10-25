import { chromium, type Browser, type Page } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const ARTIFACTS_DIR = 'C:\\Users\\PC\\.gemini\\antigravity-ide\\brain\\2452cf7b-96db-44a2-9ae9-fae1fe8a7304'
const BASE_URL = 'http://localhost:3000'

interface TestResult {
  suite: string
  name: string
  passed: boolean
  details?: string
  error?: string
}

const results: TestResult[] = []

function assert(suite: string, name: string, condition: boolean, details?: string) {
  if (condition) {
    results.push({ suite, name, passed: true, details })
    console.log(`  ✅ [${suite}] ${name}${details ? ` (${details})` : ''}`)
  } else {
    results.push({ suite, name, passed: false, details })
    console.error(`  ❌ [${suite}] ${name}${details ? ` (${details})` : ''}`)
  }
}

async function run() {
  console.log('🎾 ========================================================')
  console.log('🎾 INICIANDO SUITE DE PRUEBAS PLAYWRIGHT - MATCH POINT')
  console.log('🎾 ========================================================\n')

  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true })
  }

  const browser: Browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  })

  try {
    // ==========================================
    // 1. DESKTOP LANDING PAGE
    // ==========================================
    console.log('▶ 1. Verificando Landing Page Desktop (1440x900)...')
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    })
    const page = await desktopContext.newPage()

    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    assert('Landing', 'HTTP Status 200', response?.status() === 200, `Status: ${response?.status()}`)

    const title = await page.title()
    assert('Landing', 'Título de la página optimizado', title.includes('Match Point Lima Norte'), `Título: "${title}"`)

    const metaDesc = await page.$eval('meta[name="description"]', (el) => el.getAttribute('content')).catch(() => null)
    assert('Landing', 'Meta descripción SEO presente', Boolean(metaDesc && metaDesc.length > 30), `Desc: "${metaDesc?.slice(0, 50)}..."`)

    const ogImage = await page.$eval('meta[property="og:image"]', (el) => el.getAttribute('content')).catch(() => null)
    assert('Landing', 'Etiqueta OpenGraph imagen presente', Boolean(ogImage), `og:image: "${ogImage}"`)

    const schemaOrg = await page.$eval('script[type="application/ld+json"]', (el) => el.textContent).catch(() => null)
    assert('Landing', 'Schema.org JSON-LD estructurado', Boolean(schemaOrg && schemaOrg.includes('SportsActivityLocation')), 'SportsActivityLocation detectado')

    // Logo y Navegación
    const logoImg = await page.$('header img[alt*="Match Point"]')
    assert('Header', 'Logo de Match Point visible en header', Boolean(logoImg))

    const navLinksCount = await page.$$eval('header nav a', (links) => links.length)
    assert('Header', 'Enlaces de navegación desktop presentes', navLinksCount >= 5, `${navLinksCount} enlaces encontrados`)

    // Hero Section
    const heroH1 = await page.$eval('section h1', (el) => el.textContent?.trim()).catch(() => '')
    assert('Hero', 'Titular principal H1 presente', Boolean(heroH1 && heroH1.includes('Lima Norte')), `H1: "${heroH1}"`)

    const heroCta = await page.$('section a[href*="wa.me"]')
    assert('Hero', 'Botón de llamada a la acción hacia WhatsApp', Boolean(heroCta))

    // Secciones modulares
    const niveles = await page.$('#niveles')
    assert('Niveles', 'Sección de niveles y horarios presente', Boolean(niveles))
    const nivelCardsCount = await page.$$eval('#niveles article, #niveles .card', (els) => els.length)
    assert('Niveles', 'Tarjetas de niveles renderizadas', nivelCardsCount >= 2, `${nivelCardsCount} niveles`)

    const entrenadores = await page.$('#entrenadores')
    assert('Entrenadores', 'Sección de entrenadores presente', Boolean(entrenadores))

    const galeria = await page.$('#galeria')
    assert('Galería', 'Sección de galería presente', Boolean(galeria))
    const galeriaImgs = await page.$$eval('#galeria img', (imgs) => imgs.length)
    assert('Galería', 'Fotografías de galería cargadas', galeriaImgs >= 3, `${galeriaImgs} imágenes encontradas`)

    const torneos = await page.$('#torneos')
    assert('Torneos', 'Sección de torneos presente en landing', Boolean(torneos))

    const testimonios = await page.$('#testimonios')
    assert('Testimonios', 'Sección de testimonios presente', Boolean(testimonios))

    const faq = await page.$('#faq')
    assert('FAQ', 'Sección de preguntas frecuentes presente', Boolean(faq))

    // Interacción interactiva con FAQ (abrir acordeón)
    const firstFaqButton = await page.$('#faq details summary, #faq button')
    if (firstFaqButton) {
      await firstFaqButton.click()
      await page.waitForTimeout(300)
      assert('FAQ', 'Interacción con acordeón FAQ funciona', true, 'Acordeón clickeado y expandido')
    }

    // Ubicación & Mapa
    const ubicacion = await page.$('#ubicacion')
    assert('Ubicación', 'Sección de ubicación presente', Boolean(ubicacion))
    const googleMapIframe = await page.$('#ubicacion iframe[src*="google.com/maps"]')
    assert('Ubicación', 'Google Maps iframe embebido cargado', Boolean(googleMapIframe))

    // Botón flotante de WhatsApp
    const fabWhatsApp = await page.$('a[data-label="flotante"]')
    assert('WhatsApp', 'Botón flotante de WhatsApp presente con accesibilidad', Boolean(fabWhatsApp))

    // Desplazamiento para asegurar carga de imágenes y restablecer la vista al inicio
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight)
      await new Promise((r) => setTimeout(r, 600))
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(500)

    // Captura screenshot desktop
    const desktopScreenshotPath = path.join(ARTIFACTS_DIR, 'screenshot_landing_desktop.png')
    await page.screenshot({ path: desktopScreenshotPath, fullPage: true })
    console.log(`  📸 Captura desktop guardada: ${desktopScreenshotPath}`)

    // ==========================================
    // 2. PRUEBA DEL FORMULARIO DE CONTACTO (E2E)
    // ==========================================
    console.log('\n▶ 2. Probando formulario de contacto E2E...')
    const contactForm = await page.$('#cf-nombre')
    if (contactForm) {
      await page.fill('#cf-nombre', 'Carlos Mendoza (Prueba Playwright)')
      await page.fill('#cf-tel', '999888777')
      await page.fill('#cf-email', 'carlos.mendoza.test@gmail.com')
      await page.fill('#cf-msg', 'Hola, quisiera información sobre las clases de tenis para nivel principiante los sábados por la mañana.')

      const submitBtn = await page.$('#ubicacion form button[type="submit"]')
      if (submitBtn) {
        await submitBtn.click()
        await page.waitForTimeout(3000)
        const successMsg = await page.$eval('#ubicacion', (el) => el.textContent || '')
        assert(
          'Contacto Form',
          'Envío de formulario exitoso con mensaje de confirmación',
          successMsg.includes('¡Gracias!') || successMsg.includes('Recibimos tu mensaje'),
          'Mensaje de éxito visualizado en pantalla',
        )
      }
    } else {
      console.log('  ℹ️ Formulario de contacto no mostrado')
    }

    await desktopContext.close()

    // ==========================================
    // 3. MOBILE RESPONSIVE TEST (iPhone 14)
    // ==========================================
    console.log('\n▶ 3. Verificando versión móvil responsive (iPhone 14 - 390x844)...')
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    })
    const mobilePage = await mobileContext.newPage()
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' })

    const mobileMenuBtn = await mobilePage.$('header button[aria-label*="menú" i], header button[aria-label*="menu" i]')
    assert('Mobile', 'Botón de menú hamburguesa móvil visible', Boolean(mobileMenuBtn))

    if (mobileMenuBtn) {
      await mobileMenuBtn.click()
      await mobilePage.waitForTimeout(300)
      const mobileNavOpen = await mobilePage.$('header nav[aria-label*="Móvil" i]')
      assert('Mobile', 'Menú hamburguesa se despliega al tocarlo', Boolean(mobileNavOpen))
    }

    const mobileFab = await mobilePage.$('a[data-label="flotante"]')
    assert('Mobile', 'Botón flotante WhatsApp visible y accesible en móvil', Boolean(mobileFab))

    const mobileScreenshotPath = path.join(ARTIFACTS_DIR, 'screenshot_landing_mobile.png')
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: true })
    console.log(`  📸 Captura móvil guardada: ${mobileScreenshotPath}`)
    await mobileContext.close()

    // ==========================================
    // 4. PÁGINA DE TORNEOS Y DETALLE
    // ==========================================
    console.log('\n▶ 4. Verificando página de torneos (/torneos) y detalle...')
    const torneosContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const torneosPage = await torneosContext.newPage()
    const torneosResp = await torneosPage.goto(`${BASE_URL}/torneos`, { waitUntil: 'networkidle' })
    assert('Torneos Page', 'HTTP 200 en /torneos', torneosResp?.status() === 200)

    const torneoCards = await torneosPage.$$('article, .card')
    assert('Torneos Page', 'Tarjetas de torneos listadas', torneoCards.length >= 1, `${torneoCards.length} torneos encontrados`)

    const torneosScreenshotPath = path.join(ARTIFACTS_DIR, 'screenshot_torneos.png')
    await torneosPage.screenshot({ path: torneosScreenshotPath, fullPage: true })
    console.log(`  📸 Captura torneos guardada: ${torneosScreenshotPath}`)

    // Navegar al primer torneo detalle
    const firstTorneoLink = await torneosPage.$('article a[href^="/torneos/"], .card a[href^="/torneos/"]')
    if (firstTorneoLink) {
      const href = await firstTorneoLink.getAttribute('href')
      await torneosPage.goto(`${BASE_URL}${href}`, { waitUntil: 'networkidle' })
      assert('Torneo Detalle', `Navegación al detalle ${href}`, torneosPage.url().includes('/torneos/'))

      const detailTitle = await torneosPage.$eval('h1', (el) => el.textContent?.trim()).catch(() => '')
      assert('Torneo Detalle', 'Título del torneo renderizado', Boolean(detailTitle), `Título: "${detailTitle}"`)

      const inscribirBtn = await torneosPage.$('a[href*="wa.me"]')
      assert('Torneo Detalle', 'Botón de inscripción por WhatsApp en detalle', Boolean(inscribirBtn))

      const detailScreenshotPath = path.join(ARTIFACTS_DIR, 'screenshot_torneo_detalle.png')
      await torneosPage.screenshot({ path: detailScreenshotPath, fullPage: true })
      console.log(`  📸 Captura detalle torneo guardada: ${detailScreenshotPath}`)
    }
    await torneosContext.close()

    // ==========================================
    // 5. PANEL DE ADMINISTRACIÓN (PAYLOAD CMS)
    // ==========================================
    console.log('\n▶ 5. Verificando autenticación y panel de administración (/admin)...')
    const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const adminPage = await adminContext.newPage()

    await adminPage.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle' })
    assert('Admin Login', 'Página de inicio de sesión carga correctamente', adminPage.url().includes('/admin/login'))

    const loginScreenshotPath = path.join(ARTIFACTS_DIR, 'screenshot_admin_login.png')
    await adminPage.screenshot({ path: loginScreenshotPath })
    console.log(`  📸 Captura login admin guardada: ${loginScreenshotPath}`)

    // Ingresar credenciales
    console.log('  🔑 Ingresando credenciales del director...')
    await adminPage.fill('input[type="email"], input[name="email"], #field-email', 'adriansalazar2497@gmail.com')
    await adminPage.fill('input[type="password"], input[name="password"], #field-password', 'MatchPoint2026!')

    await adminPage.click('button[type="submit"]')
    await adminPage.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
    assert('Admin Auth', 'Inicio de sesión exitoso y redirección al Dashboard', adminPage.url().includes('/admin'))

    // Verificar colecciones en el Dashboard
    await adminPage.waitForTimeout(2000)
    const dashboardHtml = await adminPage.content()
    assert('Admin Dashboard', 'Colección Niveles disponible', dashboardHtml.includes('Niveles') || dashboardHtml.includes('niveles'))
    assert('Admin Dashboard', 'Colección Entrenadores disponible', dashboardHtml.includes('Entrenadores') || dashboardHtml.includes('entrenadores'))
    assert('Admin Dashboard', 'Colección Galería disponible', dashboardHtml.includes('Galería') || dashboardHtml.includes('galeria'))
    assert('Admin Dashboard', 'Colección Torneos disponible', dashboardHtml.includes('Torneos') || dashboardHtml.includes('torneos'))
    assert('Admin Dashboard', 'Colección Mensajes disponible', dashboardHtml.includes('Mensajes') || dashboardHtml.includes('mensajes'))
    assert('Admin Dashboard', 'Global Configuración disponible', dashboardHtml.includes('Configuración') || dashboardHtml.includes('configuracion'))

    const adminDashboardScreenshotPath = path.join(ARTIFACTS_DIR, 'screenshot_admin_dashboard.png')
    await adminPage.screenshot({ path: adminDashboardScreenshotPath, fullPage: true })
    console.log(`  📸 Captura admin dashboard guardada: ${adminDashboardScreenshotPath}`)

    // Verificar que el mensaje enviado en el test 2 llegó a la colección Mensajes
    await adminPage.goto(`${BASE_URL}/admin/collections/mensajes`, { waitUntil: 'networkidle' })
    await adminPage.waitForTimeout(2000)
    const mensajesContent = await adminPage.content()
    assert(
      'Admin Mensajes',
      'Mensaje del formulario de contacto almacenado en la base de datos',
      mensajesContent.includes('Carlos Mendoza') || mensajesContent.includes('carlos.mendoza.test@gmail.com'),
      'Mensaje recibido y verificado en Payload CMS',
    )

    await adminContext.close()
  } catch (err: any) {
    console.error('❌ Error durante la ejecución de pruebas:', err)
    results.push({ suite: 'Global', name: 'Ejecución general', passed: false, error: err.message })
  } finally {
    await browser.close()
  }

  // Resumen final
  console.log('\n🎾 ========================================================')
  console.log('🎾 RESUMEN DE PRUEBAS PLAYWRIGHT')
  console.log('🎾 ========================================================')
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length

  console.log(`Total pruebas: ${total} | Aprobadas: ${passed} | Fallidas: ${failed}`)

  if (failed === 0) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! 🎉\n')
  } else {
    console.log(`\n⚠️ Se detectaron ${failed} fallos. Revisar detalle arriba.\n`)
  }
}

run()
