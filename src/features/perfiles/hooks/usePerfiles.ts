import { useState, useEffect } from 'react'
import { obtenerPerfiles } from '../../../api/perfilesApi'
import type { PerfilPaciente } from '../../../api/perfilesApi'

export const usePerfiles = () => {
  const [perfiles, setPerfiles] = useState<PerfilPaciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await obtenerPerfiles()
        setPerfiles(data)
      } catch {
        setError('No se pudieron cargar los perfiles')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  return { perfiles, cargando, error }
}
