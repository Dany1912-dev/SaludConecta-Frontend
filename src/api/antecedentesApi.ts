import api from './axiosConfig'

// ── Tipos ────────────────────────────────────────────────────

export type CategoriaCondicion =
  | 'General' | 'Cardiaca' | 'Pulmonar'
  | 'Metabolica' | 'Endocrina' | 'Neurologica' | 'Cancer'

export type ParentescoFamiliar =
  | 'Padre' | 'Madre'
  | 'AbueloPaterno' | 'AbuelaPaterna'
  | 'AbueloMaterno' | 'AbuelaMaterna'
  | 'Hermano' | 'Hermana' | 'Otro'

export interface CondicionMedica {
  id: number
  categoria: CategoriaCondicion
  nombreCondicion: string
  orden: number
}

export interface AntecedentePersonal {
  id: number
  perfilPacienteId: number
  condicionMedica: CondicionMedica
  presente: boolean
  fechaDiagnostico?: string
  fechaResolucion?: string
  notas?: string
  fechaCreacion: string
}

export interface AntecedenteHeredofamiliar {
  id: number
  perfilPacienteId: number
  parentescoFamiliar: ParentescoFamiliar
  condicionMedica: CondicionMedica
  presente: boolean
  notas?: string
  fechaCreacion: string
}

export interface AntecedentePsicologico {
  id: number
  perfilPacienteId: number
  nombreCondicion: string
  fechaDiagnostico?: string
  fechaResolucion?: string
  activo: boolean
  notasTratamiento?: string
  fechaCreacion: string
}

// ── Helpers ──────────────────────────────────────────────────

export const etiquetaCategoria: Record<CategoriaCondicion, string> = {
  General: 'General',
  Cardiaca: 'Cardíaca',
  Pulmonar: 'Pulmonar',
  Metabolica: 'Metabólica',
  Endocrina: 'Endocrina',
  Neurologica: 'Neurológica',
  Cancer: 'Cáncer',
}

export const etiquetaParentescoFamiliar: Record<ParentescoFamiliar, string> = {
  Padre: 'Padre',
  Madre: 'Madre',
  AbueloPaterno: 'Abuelo paterno',
  AbuelaPaterna: 'Abuela paterna',
  AbueloMaterno: 'Abuelo materno',
  AbuelaMaterna: 'Abuela materna',
  Hermano: 'Hermano',
  Hermana: 'Hermana',
  Otro: 'Otro familiar',
}

// ── Endpoints — Catálogo ──────────────────────────────────────

export const obtenerCatalogoCondiciones = (categoria?: CategoriaCondicion) => {
  const url = categoria ? `/catalogo/condiciones?categoria=${categoria}` : '/catalogo/condiciones'
  return api.get<CondicionMedica[]>(url)
}

// ── Endpoints — Personales ────────────────────────────────────

export const obtenerPersonales = (perfilId: number) =>
  api.get<AntecedentePersonal[]>(`/perfiles/${perfilId}/antecedentes/personales`)

export const guardarPersonal = (perfilId: number, datos: {
  condicionMedicaId: number
  presente: boolean
  fechaDiagnostico?: string
  fechaResolucion?: string
  notas?: string
}) => api.post<AntecedentePersonal>(`/perfiles/${perfilId}/antecedentes/personales`, datos)

export const eliminarPersonal = (perfilId: number, id: number) =>
  api.delete(`/perfiles/${perfilId}/antecedentes/personales/${id}`)

// ── Endpoints — Heredo-familiares ─────────────────────────────

export const obtenerHeredofamiliares = (perfilId: number) =>
  api.get<AntecedenteHeredofamiliar[]>(`/perfiles/${perfilId}/antecedentes/heredofamiliares`)

export const crearHeredofamiliar = (perfilId: number, datos: {
  condicionMedicaId: number
  parentescoFamiliar: ParentescoFamiliar
  presente: boolean
  notas?: string
}) => api.post<AntecedenteHeredofamiliar>(`/perfiles/${perfilId}/antecedentes/heredofamiliares`, datos)

export const eliminarHeredofamiliar = (perfilId: number, id: number) =>
  api.delete(`/perfiles/${perfilId}/antecedentes/heredofamiliares/${id}`)

// ── Endpoints — Psicológicos ──────────────────────────────────

export const obtenerPsicologicos = (perfilId: number) =>
  api.get<AntecedentePsicologico[]>(`/perfiles/${perfilId}/antecedentes/psicologicos`)

export const crearPsicologico = (perfilId: number, datos: {
  nombreCondicion: string
  fechaDiagnostico?: string
  notasTratamiento?: string
}) => api.post<AntecedentePsicologico>(`/perfiles/${perfilId}/antecedentes/psicologicos`, datos)

export const desactivarPsicologico = (perfilId: number, id: number) =>
  api.delete(`/perfiles/${perfilId}/antecedentes/psicologicos/${id}`)
