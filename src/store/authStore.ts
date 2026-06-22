import { create } from 'zustand'
import { verificarSesion, logout as logoutApi } from '../api/authApi'
import type { AuthRespuesta } from '../api/authApi'
import { usePerfilStore } from './perfilStore'

interface AuthStore {
  usuario: AuthRespuesta | null
  cargando: boolean
  setUsuario: (usuario: AuthRespuesta) => void
  limpiarSesion: () => void
  inicializar: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  cargando: true,

  setUsuario: (usuario) => set({ usuario }),

  limpiarSesion: () => set({ usuario: null, cargando: false }),

  // Se llama una sola vez al montar la app
  // Intenta renovar el access token con el refresh token guardado en cookie
  inicializar: async () => {
    try {
      const { data } = await verificarSesion()
      set({ usuario: data, cargando: false })
    } catch {
      set({ usuario: null, cargando: false })
    }
  },

  logout: async () => {
    try {
      await logoutApi()
    } finally {
      // Limpiamos el estado aunque el backend falle
      set({ usuario: null })
      usePerfilStore.getState().limpiarPerfil()
    }
  },
}))