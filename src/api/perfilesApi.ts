import api from './axiosConfig'

// ---- Tipos ----

export type Genero = 'Masculino' | 'Femenino' | 'Otro'
export type TipoSangre =
  | 'APositivo' | 'ANegativo'
  | 'BPositivo' | 'BNegativo'
  | 'ABPositivo' | 'ABNegativo'
  | 'OPositivo' | 'ONegativo'
  | 'Desconocido'
export type Parentesco = 'Yo' | 'Pareja' | 'Hijo' | 'Padre' | 'Madre' | 'Hermano' | 'Otro'

export interface PerfilPaciente {
  id: number
  nombreCompleto: string
  fechaNacimiento: string
  genero: Genero
  tipoSangre: TipoSangre
  parentesco: Parentesco
  ocupacion?: string
  telefono?: string
  correoContacto?: string
  colorAvatar: string
  activo: boolean
  fechaCreacion: string
}

export interface CrearPerfilPayload {
  nombreCompleto: string
  fechaNacimiento: string
  genero: Genero
  tipoSangre?: TipoSangre
  parentesco?: Parentesco
  ocupacion?: string
  lugarNacimiento?: string
  telefono?: string
  telefonoEmergencia?: string
  correoContacto?: string
  direccion?: string
  colorAvatar?: string
}

// ---- Helpers de etiquetas ----

export const etiquetaParentesco: Record<Parentesco, string> = {
  Yo: 'Yo',
  Pareja: 'Pareja',
  Hijo: 'Hijo/a',
  Padre: 'Padre',
  Madre: 'Madre',
  Hermano: 'Hermano/a',
  Otro: 'Otro',
}

export const etiquetaTipoSangre: Record<TipoSangre, string> = {
  APositivo: 'A+', ANegativo: 'A-',
  BPositivo: 'B+', BNegativo: 'B-',
  ABPositivo: 'AB+', ABNegativo: 'AB-',
  OPositivo: 'O+', ONegativo: 'O-',
  Desconocido: 'Desconocido',
}

// ---- Endpoints ----

export const obtenerPerfiles = () =>
  api.get<PerfilPaciente[]>('/perfiles')

export const crearPerfil = (datos: CrearPerfilPayload) =>
  api.post<PerfilPaciente>('/perfiles', datos)

export const actualizarPerfil = (id: number, datos: Partial<CrearPerfilPayload>) =>
  api.put<PerfilPaciente>(`/perfiles/${id}`, datos)

export const desactivarPerfil = (id: number) =>
  api.delete(`/perfiles/${id}`)
