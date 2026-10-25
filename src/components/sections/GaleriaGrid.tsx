'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

import { IconClose } from '@/components/ui/Icons'

export type FotoItem = { id: string | number; thumb: string; full: string; alt: string; titulo: string; w: number; h: number }

/** Galería con visor ampliado (<dialog> nativo: Escape cierra, foco atrapado por el navegador). */
export function GaleriaGrid({ fotos }: { fotos: FotoItem[] }) {
  const dlg = useRef<HTMLDialogElement>(null)
  const [actual, setActual] = useState<FotoItem | null>(null)

  const abrir = (f: FotoItem) => {
    setActual(f)
    dlg.current?.showModal()
  }
  const cerrar = () => dlg.current?.close()

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4">
        {fotos.map((f, i) => (
          <li key={f.id} className="reveal mb-3 break-inside-avoid md:mb-4">
            <button
              type="button"
              onClick={() => abrir(f)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-brand-soft"
              aria-label={`Ampliar foto: ${f.titulo}`}
            >
              <Image
                src={f.thumb}
                alt={f.alt}
                width={f.w}
                height={f.h}
                sizes="(min-width: 768px) 360px, 50vw"
                loading={i < 2 ? 'eager' : 'lazy'}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand/85 to-transparent p-3 text-left text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {f.titulo}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dlg}
        className="lightbox"
        aria-label={actual ? actual.titulo : 'Foto ampliada'}
        onClick={(e) => e.target === dlg.current && cerrar()}
        onClose={() => setActual(null)}
      >
        {actual && (
          <figure className="relative">
            <Image
              src={actual.full}
              alt={actual.alt}
              width={actual.w}
              height={actual.h}
              sizes="96vw"
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-2 text-center text-sm font-semibold text-white">{actual.titulo}</figcaption>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute -top-3 -right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-brand shadow-lg"
            >
              <IconClose width={22} height={22} />
            </button>
          </figure>
        )}
      </dialog>
    </>
  )
}
