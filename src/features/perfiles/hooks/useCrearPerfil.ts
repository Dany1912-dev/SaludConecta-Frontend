import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearPerfil } from '../../../api/perfilesApi'
import type { CrearPerfilPayload, Genero, TipoSangre, Parentesco } from '../../../api/perfilesApi'

const FORM_INICIAL: CrearPerfilPayload = {
  nombreCompleto: '',
  fechaNacimiento: '',
  genero: 'Masculino',
  tipoSangre: 'Desconocido',
  parentesco: 'Yo',
  colorAvatar: '#6366F1',
  lugarNacimiento: '',
  telefono: '',
  telefonoEmergencia: '',
  correoContacto: '',
  ocupacion: '',
  direccion: '',
}

export const useCrearPerfil = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<CrearPerfilPayload>(FORM_INICIAL)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (campo: keyof CrearPerfilPayload, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setError(null)
  }

  const setGenero = (v: Genero) => setForm((p) => ({ ...p, genero: v }))
  const setTipoSangre = (v: TipoSangre) => setForm((p) => ({ ...p, tipoSangre: v }))
  const setParentesco = (v: Parentesco) => setForm((p) => ({ ...p, parentesco: v }))
  const setColorAvatar = (v: string) => setForm((p) => ({ ...p, colorAvatar: v }))

  const validarPaso = (paso: number): string | null => {
    if (paso === 1) {
      if (!form.nombreCompleto.trim()) return 'El nombre completo es requerido'
      if (!form.fechaNacimiento) return 'La fecha de nacimiento es requerida'
    }
    return null
  }

  const guardarPerfil = async () => {
    setCargando(true)
    setError(null)

    // Limpiar campos vacíos opcionales antes de enviar
    const payload: CrearPerfilPayload = {
      ...form,
      nombreCompleto: form.nombreCompleto.trim(),
      lugarNacimiento: form.lugarNacimiento?.trim() || undefined,
      telefono: form.telefono?.trim() || undefined,
      telefonoEmergencia: form.telefonoEmergencia?.trim() || undefined,
      correoContacto: form.correoContacto?.trim() || undefined,
      ocupacion: form.ocupacion?.trim() || undefined,
      direccion: form.direccion?.trim() || undefined,
    }

    try {
      await crearPerfil(payload)
      navigate('/perfiles', { replace: true })
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error ??
        err.response?.data?.mensaje ??
        'Ocurrió un error al crear el perfil'
      setError(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return {
    form, cargando, error,
    handleChange, setGenero, setTipoSangre, setParentesco, setColorAvatar,
    validarPaso, guardarPerfil,
  }
}
