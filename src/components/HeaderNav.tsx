'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { IconClose, IconMenu, IconWhatsApp } from '@/components/ui/Icons'

type Item = { href: string; label: string }

/** Encabezado fijo con menú móvil accesible (Escape cierra, foco visible). */
export function HeaderNav({
  items,
  whatsappHref,
  ctaTexto,
  logo,
}: {
  items: Item[]
  whatsappHref: string
  ctaTexto: string
  logo: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-brand/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Ir al inicio" className="shrink-0">
          {logo}
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {items.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="rounded-full px-3.5 py-2 font-display text-[0.95rem] font-semibold text-brand transition-colors hover:bg-brand/8"
            >
              {i.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-event="whatsapp_click"
            data-label="header"
            className="btn btn-primary hidden !min-h-11 !px-5 !py-2 text-sm sm:inline-flex"
          >
            <IconWhatsApp width={18} height={18} />
            {ctaTexto}
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand hover:bg-brand/8 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-movil" className="absolute inset-x-0 top-full border-b border-brand/10 bg-white shadow-xl lg:hidden">
          <nav aria-label="Menú móvil" className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {items.map((i) => (
              <a
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 font-display text-lg font-semibold text-brand hover:bg-brand/8"
              >
                {i.label}
              </a>
            ))}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp_click"
              data-label="menu_movil"
              className="btn btn-primary mt-3"
            >
              <IconWhatsApp width={20} height={20} />
              {ctaTexto}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
