import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registro } from '../../../api/authApi'
import { useAuthStore } from '../../../store/authStore'

interface FormRegistro {
  nombre: string
  correo: string
  contrasena: string
  telefono: string
}

interface ErroresForm {
  nombre?: string
  correo?: string
  contrasena?: string
}

const validar = (form: FormRegistro): ErroresForm => {
  const errores: ErroresForm = {}

  if (!form.nombre.trim())
    errores.nombre = 'El nombre es requerido'

  if (!form.correo.trim())
    errores.correo = 'El correo es requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
    errores.correo = 'El formato del correo no es válido'

  if (!form.contrasena)
    errores.contrasena = 'La contraseña es requerida'
  else if (form.contrasena.length < 8)
    errores.contrasena = 'La contraseña debe tener al menos 8 caracteres'

  return errores
}

export const useRegistro = () => {
  const navigate = useNavigate()
  const setUsuario = useAuthStore((s) => s.setUsuario)

  const [form, setForm] = useState<FormRegistro>({
    nombre: '',
    correo: '',
    contrasena: '',
    telefono: '',
  })
  const [errores, setErrores] = useState<ErroresForm>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrores((prev) => ({ ...prev, [e.target.name]: undefined }))
    setErrorGeneral(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const erroresValidacion = validar(form)
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    setCargando(true)
    setErrorGeneral(null)

    try {
      const payload = {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        contrasena: form.contrasena,
        telefono: form.telefono.trim() || undefined,
      }
      const { data } = await registro(payload)
      setUsuario(data)
      navigate('/perfiles', { replace: true })
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error ??
        err.response?.data?.mensaje ??
        'Ocurrió un error. Intenta de nuevo.'
      setErrorGeneral(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return { form, errores, errorGeneral, cargando, handleChange, handleSubmit }
}