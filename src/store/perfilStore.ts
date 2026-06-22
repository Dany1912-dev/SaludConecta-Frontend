import { create } from 'zustand'
import type { PerfilPaciente } from '../api/perfilesApi'

interface PerfilStore {
  perfilActivo: PerfilPaciente | null
  setPerfilActivo: (perfil: PerfilPaciente) => void
  limpiarPerfil: () => void
}

export const usePerfilStore = create<PerfilStore>((set) => ({
  perfilActivo: null,
  setPerfilActivo: (perfil) => set({ perfilActivo: perfil }),
  limpiarPerfil: () => set({ perfilActivo: null }),
}))
