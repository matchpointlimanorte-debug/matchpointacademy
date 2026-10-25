import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import config from '../payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function seed() {
  console.log('🎾 Iniciando seed de Match Point Lima Norte...')
  const payload = await getPayload({ config })

  // 1. Usuario Administrador (Director)
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'adriansalazar2497@gmail.com').toLowerCase().trim()
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'MatchPoint2026!'

  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  if (existingUsers.totalDocs === 0) {
    console.log(`👤 Creando usuario director: ${adminEmail}`)
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        nombre: 'Director Match Point',
        rol: 'admin',
      },
    })
  } else {
    console.log(`ℹ️ Usuario ${adminEmail} ya existe.`)
  }

  // 2. Subir Medios iniciales (si no existen ya)
  const assetsDir = path.join(__dirname, 'assets')
  const mediaMap: Record<string, number> = {}

  const filesToUpload: Array<{ key: string; filename: string; alt: string }> = [
    { key: 'logo', filename: 'logo.png', alt: 'Logo de Match Point Lima Norte' },
    { key: 'icono', filename: 'icono.png', alt: 'Ícono Match Point pelota y pin' },
    { key: 'grupo', filename: 'grupo-clase.jpg', alt: 'Grupo de alumnos y entrenadores en cancha de arcilla de Match Point' },
    { key: 'galeria2', filename: 'galeria-2.jpg', alt: 'Entrenamiento en cancha de tenis' },
    { key: 'galeria3', filename: 'galeria-3.jpg', alt: 'Clase de tenis y práctica de saque' },
    { key: 'galeria4', filename: 'galeria-4.jpg', alt: 'Comunidad de alumnos de tenis en Lima Norte' },
    { key: 'og', filename: 'og-default.jpg', alt: 'Match Point Lima Norte en redes sociales' },
  ]

  for (const item of filesToUpload) {
    const filePath = path.join(assetsDir, item.filename)
    if (!fs.existsSync(filePath)) continue

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: item.filename } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      mediaMap[item.key] = Number(existing.docs[0].id)
      const mediaDir = path.join(process.cwd(), 'media')
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true })
      const diskPath = path.join(mediaDir, item.filename)
      if (!fs.existsSync(diskPath) && fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, diskPath)
      }
    } else {
      console.log(`🖼️ Subiendo archivo: ${item.filename}`)
      const buffer = fs.readFileSync(filePath)
      const created = await payload.create({
        collection: 'media',
        data: {
          alt: item.alt,
        },
        file: {
          data: buffer,
          name: item.filename,
          size: buffer.length,
          mimetype: item.filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
        },
      })
      mediaMap[item.key] = Number(created.id)
    }
  }

  // 3. Global: Configuración del sitio
  console.log('⚙️ Configurando datos globales de marca y contacto...')
  await payload.updateGlobal({
    slug: 'configuracion',
    data: {
      nombreSitio: 'Match Point Lima Norte',
      heroEtiqueta: 'Academia de Tenis & Torneos',
      heroTitular: 'Impulsa tu tenis en [[Lima Norte]]',
      heroSubtitulo:
        'Academia comprometida con el aprendizaje y la competencia. Formamos jugadores con talento, disciplina y pasión, sin importar tu nivel inicial.',
      heroCtaTexto: 'Reserva tu clase de prueba',
      heroImagen: mediaMap.grupo || undefined,
      quienesTitulo: 'Quiénes somos',
      quienesTexto:
        'Somos una academia de tenis comprometida con impulsar el aprendizaje y la práctica competitiva en Lima Norte. Nuestro objetivo es formar futuros jugadores con talento, disciplina y pasión, sin importar su nivel inicial.\n\nContamos con entrenadores dedicados, un ambiente deportivo formativo y canchas de arcilla para niños, jóvenes y adultos.',
      quienesImagen: mediaMap.grupo || undefined,
      puntosClave: [
        {
          titulo: 'Talento',
          descripcion: 'Desarrollamos tus habilidades técnicas y tácticas desde el primer día.',
        },
        {
          titulo: 'Disciplina',
          descripcion: 'Fomentamos hábitos deportivos y constancia para superarte dentro y fuera de la cancha.',
        },
        {
          titulo: 'Pasión',
          descripcion: 'Vive la emoción del tenis y el espíritu de superación en cada partido.',
        },
      ],
      telefonos: [{ numero: '916 727 470' }, { numero: '987 547 599' }],
      whatsappNumero: '51916727470',
      whatsappMensaje: 'Hola Match Point Lima Norte, quiero reservar una clase de prueba.',
      email: 'adriansalazar2497@gmail.com',
      direccion: 'Fuertes Hoyos, Rímac (entrada por Av. Túpac Amaru con Av. Francisco Pizarro)',
      referencia: 'Entrada por Av. Túpac Amaru con Av. Francisco Pizarro, frente a Fuertes Hoyos, Rímac, Lima.',
      latitud: -12.0305,
      longitud: -77.0308,
      instagram: 'https://www.instagram.com/matchpointlimanorte',
      tiktok: 'https://www.tiktok.com/@matchpointlimanorte',
      colorPrimario: '#0E2F55',
      colorAcento: '#DBDB11',
      logo: mediaMap.logo || undefined,
      icono: mediaMap.icono || undefined,
      ogImagen: mediaMap.og || undefined,
      seoTitulo: 'Match Point Lima Norte | Academia de Tenis & Torneos',
      seoDescripcion:
        'Academia de tenis en Lima Norte: clases de iniciación, intermedios y torneos. Reserva tu clase de prueba por WhatsApp.',
      formularioActivo: true,
      _status: 'published',
    },
  })

  // 4. Global: Orden y visibilidad de secciones en la Landing
  console.log('📐 Configurando orden de secciones...')
  await payload.updateGlobal({
    slug: 'landing',
    data: {
      secciones: [
        { tipo: 'hero', visible: true, etiquetaMenu: '' },
        { tipo: 'quienes', visible: true, etiquetaMenu: 'Nosotros', titulo: 'Quiénes somos' },
        { tipo: 'niveles', visible: true, etiquetaMenu: 'Horarios', titulo: 'Niveles y horarios' },
        { tipo: 'entrenadores', visible: true, etiquetaMenu: 'Entrenadores', titulo: 'Nuestros entrenadores' },
        { tipo: 'galeria', visible: true, etiquetaMenu: 'Galería', titulo: 'Galería de fotos' },
        { tipo: 'torneos', visible: true, etiquetaMenu: 'Torneos', titulo: 'Torneos & Competencias' },
        { tipo: 'planes', visible: false, etiquetaMenu: 'Planes', titulo: 'Planes y precios' }, // OCULTO por indicación del usuario
        { tipo: 'testimonios', visible: true, etiquetaMenu: 'Testimonios', titulo: 'Testimonios' },
        { tipo: 'faq', visible: true, etiquetaMenu: 'Preguntas', titulo: 'Preguntas frecuentes' },
        { tipo: 'ubicacion', visible: true, etiquetaMenu: 'Ubicación', titulo: 'Ubicación y contacto' },
      ],
      _status: 'published',
    },
  })

  // 5. Colección: Niveles y Horarios
  console.log('🎾 Sembrando niveles y horarios...')
  const nivelesData = [
    {
      nombre: 'Principiantes',
      descripcion: 'Aprende los fundamentos del tenis desde cero: agarre de raqueta, derecha, revés y saque con técnica guiada.',
      edades: 'Jóvenes y adultos',
      cupoDisponible: 'Cupos disponibles',
      destacado: true,
      horarios: [
        { dia: 'sabado' as const, horaInicio: '09:00', horaFin: '10:30' },
        { dia: 'domingo' as const, horaInicio: '08:00', horaFin: '09:30' },
      ],
      _status: 'published' as const,
    },
    {
      nombre: 'Intermedios',
      descripcion: 'Perfecciona tu consistencia, efectos de pelota, estrategia de juego en cancha y ritmo de peloteo continuo.',
      edades: 'Con experiencia previa',
      cupoDisponible: 'Pocos cupos',
      destacado: false,
      horarios: [{ dia: 'sabado' as const, horaInicio: '10:30', horaFin: '12:00' }],
      _status: 'published' as const,
    },
  ]

  for (const n of nivelesData) {
    const existing = await payload.find({
      collection: 'niveles',
      where: { nombre: { equals: n.nombre } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'niveles', data: n })
    }
  }

  // 6. Colección: Torneos
  console.log('🏆 Sembrando torneos...')
  const torneosData = [
    {
      titulo: 'Copa Match Point 2027',
      slug: 'copa-match-point-2027',
      estado: 'proximo' as const,
      fechaTexto: 'Próximamente',
      categoria: 'Principiantes e Intermedios',
      lugar: 'Fuertes Hoyos, Rímac',
      resumen: 'Próximamente: circuito de torneos Match Point Lima Norte. Prepárate para competir y medir tu nivel en cancha.',
      costo: 'Por anunciar',
      afiche: mediaMap.grupo || undefined,
      inscripcionTipo: 'whatsapp' as const,
      mensajeWhatsApp: 'Hola Match Point, quiero recibir información sobre la Copa Match Point 2027.',
      _status: 'published' as const,
    },
    {
      titulo: 'Torneo Apertura Lima Norte 2026',
      slug: 'torneo-apertura-lima-norte-2026',
      estado: 'finalizado' as const,
      fechaInicio: '2026-02-15T00:00:00.000Z',
      fechaFin: '2026-02-22T00:00:00.000Z',
      categoria: 'Principiantes e Intermedios',
      lugar: 'Fuertes Hoyos, Rímac',
      resumen: 'Primera edición del torneo relámpago con gran participación de alumnos y amigos de la academia.',
      afiche: mediaMap.galeria2 || undefined,
      resultados: [
        {
          categoria: 'Intermedios Masculino',
          campeon: 'Carlos Mendoza',
          subcampeon: 'Diego Huamán',
          tercero: 'Luis Ramos',
        },
        {
          categoria: 'Principiantes Abierto',
          campeon: 'Andrea Salazar',
          subcampeon: 'Gabriel Castro',
          tercero: 'Renzo Poma',
        },
      ],
      _status: 'published' as const,
    },
  ]

  for (const t of torneosData) {
    const existing = await payload.find({
      collection: 'torneos',
      where: { slug: { equals: t.slug } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'torneos', data: t })
    }
  }

  // 7. Colección: Galería
  console.log('📸 Sembrando fotos en galería...')
  const galeriaData = [
    { titulo: 'Clase grupal de los sábados', imagen: mediaMap.grupo, categoria: 'clases' as const },
    { titulo: 'Práctica de volea y control', imagen: mediaMap.galeria2, categoria: 'clases' as const },
    { titulo: 'Cancha de arcilla en Fuertes Hoyos', imagen: mediaMap.galeria3, categoria: 'instalaciones' as const },
    { titulo: 'Comunidad Match Point Lima Norte', imagen: mediaMap.galeria4, categoria: 'comunidad' as const },
  ]

  for (const g of galeriaData) {
    if (!g.imagen) continue
    const existing = await payload.find({
      collection: 'galeria',
      where: { titulo: { equals: g.titulo } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'galeria', data: g })
    }
  }

  // 8. Colección: Entrenadores
  console.log('👟 Sembrando entrenadores...')
  const entrenadoresData = [
    {
      nombre: 'Profesor Principal Match Point',
      cargo: 'Director Técnico & Entrenador',
      bio: 'Especialista en iniciación y desarrollo competitivo de tenis en Lima Norte con amplia trayectoria formativa.',
      certificaciones: 'Certificación PTR / ITF Nivel 1',
      foto: mediaMap.grupo || mediaMap.galeria2,
      _status: 'published' as const,
    },
  ]

  for (const e of entrenadoresData) {
    if (!e.foto) continue
    const existing = await payload.find({
      collection: 'entrenadores',
      where: { nombre: { equals: e.nombre } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'entrenadores', data: e })
    }
  }

  // 9. Colección: Preguntas frecuentes (FAQ)
  console.log('❓ Sembrando preguntas frecuentes...')
  const faqs = [
    {
      pregunta: '¿Necesito tener mi propia raqueta para la clase de prueba?',
      respuesta:
        'No es obligatorio. En Match Point te prestamos raqueta y pelotas para tu primera clase de prueba si aún no cuentas con una.',
      _status: 'published' as const,
    },
    {
      pregunta: '¿Qué vestimenta y calzado debo llevar?',
      respuesta:
        'Ven con ropa deportiva cómoda y zapatillas deportivas con suela adecuada para cancha de arcilla (ideal suela espiga o suela lisa/multiterreno para cuidar la cancha). Trae agua y toalla.',
      _status: 'published' as const,
    },
    {
      pregunta: '¿Puedo empezar si nunca antes he jugado tenis?',
      respuesta:
        '¡Totalmente! Tenemos el nivel Principiantes diseñado especialmente para quienes toman una raqueta por primera vez. Aprendes paso a paso con paciencia y técnica.',
      _status: 'published' as const,
    },
    {
      pregunta: '¿Cómo coordino mi clase de prueba?',
      respuesta:
        'Solo haz clic en el botón de WhatsApp o escríbenos al 916 727 470 indicando tu nombre y el horario de tu preferencia.',
      _status: 'published' as const,
    },
  ]

  for (const f of faqs) {
    const existing = await payload.find({
      collection: 'faq',
      where: { pregunta: { equals: f.pregunta } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'faq', data: f })
    }
  }

  // 10. Colección: Testimonios
  console.log('💬 Sembrando testimonios...')
  const testimoniosData = [
    {
      nombre: 'Rodrigo Flores',
      detalle: 'Alumno Nivel Intermedio',
      texto:
        'Excelente ambiente y paciencia de los profesores. Empecé sin saber sacar y hoy juego torneos internos todos los meses.',
      estrellas: 5,
      _status: 'published' as const,
    },
    {
      nombre: 'Mariana Chávez',
      detalle: 'Alumna Nivel Principiante',
      texto:
        'La cancha en Fuertes Hoyos es súper céntrica para los que vivimos en Lima Norte. Las clases de los fines de semana son el mejor plan.',
      estrellas: 5,
      _status: 'published' as const,
    },
  ]

  for (const tm of testimoniosData) {
    const existing = await payload.find({
      collection: 'testimonios',
      where: { nombre: { equals: tm.nombre } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'testimonios', data: tm })
    }
  }

  console.log('✅ Seed completado con éxito.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error ejecutando seed:', err)
  process.exit(1)
})
