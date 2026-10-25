import React from 'react'

/** Logo del panel (pantalla de login y barra lateral). Usa el logo original sin modificar su estructura. */
export const Logo: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/logo.png"
    alt="Match Point Lima Norte"
    style={{ width: '100%', maxWidth: 260, height: 'auto' }}
  />
)

/** Ícono compacto (barra de navegación colapsada). */
export const Icon: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/icon.png" alt="Match Point" style={{ width: 28, height: 'auto' }} />
)
