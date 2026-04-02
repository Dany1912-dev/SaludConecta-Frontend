import React from 'react'
import { Loader2 } from 'lucide-react'

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'fantasma'
  cargando?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export const Boton = ({
  variante = 'primario',
  cargando = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: BotonProps) => {

  const estilosBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 20px',
    fontSize: 'var(--texto-md)',
    fontWeight: 600,
    borderRadius: 'var(--radio-md)',
    border: 'none',
    cursor: disabled || cargando ? 'not-allowed' : 'pointer',
    transition: 'all var(--transicion-rapida)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || cargando ? 0.7 : 1,
  }

  const estilosPorVariante: Record<string, React.CSSProperties> = {
    primario: {
      backgroundColor: 'var(--color-primario)',
      color: '#FFFFFF',
    },
    secundario: {
      backgroundColor: 'var(--color-fondo-secundario)',
      color: 'var(--color-primario)',
      border: '1.5px solid var(--color-borde)',
    },
    fantasma: {
      backgroundColor: 'transparent',
      color: 'var(--color-primario)',
    },
  }

  return (
    <button
      disabled={disabled || cargando}
      style={{ ...estilosBase, ...estilosPorVariante[variante], ...style }}
      onMouseEnter={(e) => {
        if (!disabled && !cargando && variante === 'primario') {
          e.currentTarget.style.backgroundColor = 'var(--color-primario-hover)'
        }
      }}
      onMouseLeave={(e) => {
        if (variante === 'primario') {
          e.currentTarget.style.backgroundColor = 'var(--color-primario)'
        }
      }}
      {...props}
    >
      {cargando && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  )
}