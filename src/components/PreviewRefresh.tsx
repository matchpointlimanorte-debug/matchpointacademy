'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/** Solo en modo vista previa: refresca la página cuando se guarda un borrador en el admin. */
export function PreviewRefresh() {
  const router = useRouter()
  return (
    <>
      <RefreshRouteOnSave
        refresh={() => router.refresh()}
        serverURL={typeof window !== 'undefined' ? window.location.origin : ''}
      />
      <div className="fixed left-3 top-3 z-[60] rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand shadow-lg">
        Vista previa (borrador)
      </div>
    </>
  )
}
