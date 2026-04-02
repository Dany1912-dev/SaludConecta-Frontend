import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icono?: React.ReactNode
}

export const Input = ({ label, error, icono, type, ...props }: InputProps) => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const esContrasena = type === 'password'
  const tipoFinal = esContrasena ? (mostrarContrasena ? 'text' : 'password') : type

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: 'var(--texto-sm)',
        fontWeight: 500,
        color: 'var(--color-texto-principal)',
      }}>
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        {icono && (
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-texto-suave)',
            display: 'flex',
            alignItems: 'center',
          }}>
            {icono}
          </span>
        )}

        <input
          type={tipoFinal}
          style={{
            width: '100%',
            padding: icono ? '10px 40px 10px 40px' : '10px 40px 10px 14px',
            fontSize: 'var(--texto-md)',
            color: 'var(--color-texto-principal)',
            backgroundColor: 'var(--color-fondo)',
            border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-borde)'}`,
            borderRadius: 'var(--radio-md)',
            outline: 'none',
            transition: 'border-color var(--transicion-rapida)',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'var(--color-error)'
              : 'var(--color-primario)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'var(--color-error)'
              : 'var(--color-borde)'
          }}
          {...props}
        />

        {esContrasena && (
          <button
            type="button"
            onClick={() => setMostrarContrasena((v) => !v)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-texto-suave)',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
          >
            {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span style={{
          fontSize: 'var(--texto-xs)',
          color: 'var(--color-error)',
        }}>
          {error}
        </span>
      )}
    </div>
  )
}