import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => null)
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Datos no válidos.' }, { status: 400 })
    }

    const { nombre, telefono, email, mensaje, web } = data as {
      nombre?: string
      telefono?: string
      email?: string
      mensaje?: string
      web?: string
    }

    // Honeypot anti-spam: los humanos no llenan este campo invisible
    if (web) {
      return NextResponse.json({ ok: true })
    }

    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: 'Por favor indica tu nombre.' }, { status: 400 })
    }

    if (!mensaje || !mensaje.trim()) {
      return NextResponse.json({ error: 'Por favor escribe tu mensaje.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 1. Guardar en la colección de mensajes de Payload
    await payload.create({
      collection: 'mensajes',
      data: {
        nombre: nombre.trim(),
        telefono: telefono ? telefono.trim() : '',
        email: email ? email.trim() : '',
        mensaje: mensaje.trim(),
      },
      overrideAccess: true,
    })

    // 2. Si hay servicio de email configurado, enviar aviso al director
    const destinoEmail = process.env.CONTACT_EMAIL_TO || 'adriansalazar2497@gmail.com'
    if (process.env.RESEND_API_KEY && destinoEmail) {
      try {
        await payload.sendEmail({
          to: destinoEmail,
          subject: `Nuevo mensaje de contacto en la web: ${nombre}`,
          html: `
            <div style="font-family:Arial,sans-serif;color:#0e2f55;max-width:560px;margin:auto;">
              <h2 style="color:#0e2f55;border-bottom:2px solid #dbdb11;padding-bottom:8px;">Nuevo mensaje desde la web</h2>
              <p><strong>Nombre:</strong> ${nombre}</p>
              ${telefono ? `<p><strong>Teléfono:</strong> <a href="tel:${telefono}">${telefono}</a> | <a href="https://wa.me/${telefono.replace(/\D/g, '')}">Abrir WhatsApp</a></p>` : ''}
              ${email ? `<p><strong>Correo:</strong> <a href="mailto:${email}">${email}</a></p>` : ''}
              <p><strong>Mensaje:</strong></p>
              <blockquote style="background:#f6f7f2;padding:12px;border-left:4px solid #1f7a4d;margin:12px 0;">
                ${mensaje.replace(/\n/g, '<br/>')}
              </blockquote>
              <p style="font-size:12px;color:#777;">Recibido a través del sitio web de Match Point Lima Norte.</p>
            </div>
          `,
        })
      } catch (e) {
        console.error('Error al enviar correo de contacto:', e)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en /api/contacto:', error)
    return NextResponse.json({ error: 'No se pudo procesar tu mensaje. Escríbenos directamente por WhatsApp.' }, { status: 500 })
  }
}
