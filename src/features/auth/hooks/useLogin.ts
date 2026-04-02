import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../../api/authApi'
import { useAuthStore } from '../../../store/authStore'

interface FormLogin {
  correo: string
  contrasena: string
}

export const useLogin = () => {
  const navigate = useNavigate()
  const setUsuario = useAuthStore((s) => s.setUsuario)

  const [form, setForm] = useState<FormLogin>({ correo: '', contrasena: '' })
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError(null)

    try {
      const { data } = await login(form)
      setUsuario(data)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error ??
        err.response?.data?.mensaje ??
        'Ocurrió un error. Intenta de nuevo.'
      setError(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return { form, error, cargando, handleChange, handleSubmit }
}