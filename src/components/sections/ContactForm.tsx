'use client'

import { useState } from 'react'

type Estado = 'idle' | 'enviando' | 'ok' | 'error'

/** Formulario de contacto (opcional). Envía a /api/contacto; incluye campo trampa anti-spam. */
export function ContactForm() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensajeError, setMensajeError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEstado('enviando')
    setMensajeError('')
    const form = e.currentTarget
    const datos = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(json.error || 'No se pudo enviar. Intenta por WhatsApp.')
      form.reset()
      setEstado('ok')
    } catch (err) {
      setMensajeError(err instanceof Error ? err.message : 'Error inesperado.')
      setEstado('error')
    }
  }

  const campo =
    'w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-accent'

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8" noValidate={false}>
      <h3 className="text-2xl font-extrabold">Escríbenos un mensaje</h3>

      {/* Campo trampa: las personas no lo ven; los bots sí lo llenan. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input type="text" name="web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="cf-nombre" className="mb-1 block text-sm font-semibold text-brand">Nombre *</label>
        <input id="cf-nombre" name="nombre" required maxLength={80} autoComplete="name" className={campo} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-tel" className="mb-1 block text-sm font-semibold text-brand">Teléfono</label>
          <input id="cf-tel" name="telefono" type="tel" maxLength={25} autoComplete="tel" className={campo} />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1 block text-sm font-semibold text-brand">Correo</label>
          <input id="cf-email" name="email" type="email" maxLength={120} autoComplete="email" className={campo} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-msg" className="mb-1 block text-sm font-semibold text-brand">Mensaje *</label>
        <textarea id="cf-msg" name="mensaje" required rows={4} maxLength={1000} className={campo} />
      </div>

      <button type="submit" disabled={estado === 'enviando'} className="btn btn-dark w-full disabled:opacity-60">
        {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold">
        {estado === 'ok' && <span className="text-court">¡Gracias! Recibimos tu mensaje y te responderemos pronto.</span>}
        {estado === 'error' && <span className="text-red-700">{mensajeError}</span>}
      </p>
    </form>
  )
}
