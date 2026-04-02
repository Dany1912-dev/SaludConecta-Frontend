import { create } from 'zustand'

type Tema = 'light' | 'dark'

interface TemaStore {
  tema: Tema
  toggleTema: () => void
  inicializarTema: () => void
}

const aplicarTema = (tema: Tema) => {
  document.documentElement.setAttribute('data-theme', tema)
  localStorage.setItem('sc-tema', tema)
}

export const useTemaStore = create<TemaStore>((set, get) => ({
  tema: 'light',

  toggleTema: () => {
    const nuevoTema: Tema = get().tema === 'light' ? 'dark' : 'light'
    aplicarTema(nuevoTema)
    set({ tema: nuevoTema })
  },

  inicializarTema: () => {
    const guardado = localStorage.getItem('sc-tema') as Tema | null
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
    const tema: Tema = guardado ?? (prefiereOscuro ? 'dark' : 'light')
    aplicarTema(tema)
    set({ tema })
  },
}))