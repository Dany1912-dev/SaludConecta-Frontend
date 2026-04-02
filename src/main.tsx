import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRouter from './router/AppRouter'
import { useAuthStore } from './store/authStore'
import { useTemaStore } from './store/temaStore'
import './styles/variables.css'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
    },
  },
})

// Componente raíz que inicializa el estado global antes de renderizar
const App = () => {
  const inicializarAuth = useAuthStore((s) => s.inicializar)
  const inicializarTema = useTemaStore((s) => s.inicializarTema)
  const cargando = useAuthStore((s) => s.cargando)

  useEffect(() => {
    inicializarTema()
    inicializarAuth()
  }, [])

  // Escuchar el evento de sesión expirada que dispara axiosConfig
  useEffect(() => {
    const limpiarSesion = useAuthStore.getState().limpiarSesion
    const handler = () => limpiarSesion()
    window.addEventListener('sc:sesion-expirada', handler)
    return () => window.removeEventListener('sc:sesion-expirada', handler)
  }, [])

  // Mientras verifica la sesión no renderizamos nada
  // Evita el parpadeo de redirigir al login y luego al dashboard
  if (cargando) return null

  return <AppRouter />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)