import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag para evitar múltiples intentos de refresh simultáneos
let refrescando = false
let colaDeEspera: Array<() => void> = []

const procesarCola = () => {
  colaDeEspera.forEach((cb) => cb())
  colaDeEspera = []
}

// Interceptor de respuesta — maneja el refresh automático ante un 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const solicitudOriginal = error.config

    // Si es 401 y no es el propio endpoint de refresh o login
    const esEndpointDeAuth =
      solicitudOriginal.url?.includes('/auth/refresh') ||
      solicitudOriginal.url?.includes('/auth/login') ||
      solicitudOriginal.url?.includes('/auth/registro')

    if (error.response?.status === 401 && !esEndpointDeAuth && !solicitudOriginal._reintentado) {
      solicitudOriginal._reintentado = true

      if (refrescando) {
        // Si ya hay un refresh en curso, encolar la solicitud
        return new Promise((resolve) => {
          colaDeEspera.push(() => resolve(api(solicitudOriginal)))
        })
      }

      refrescando = true

      try {
        await api.post('/auth/refresh')
        procesarCola()
        return api(solicitudOriginal)
      } catch {
        // El refresh falló — limpiar sesión
        colaDeEspera = []
        window.dispatchEvent(new CustomEvent('sc:sesion-expirada'))
        return Promise.reject(error)
      } finally {
        refrescando = false
      }
    }

    return Promise.reject(error)
  }
)

export default api