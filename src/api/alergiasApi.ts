import api from './axiosConfig'

// ── Tipos ────────────────────────────────────────────────────

export type TipoAlergia = 'Alimentaria' | 'Medicamentosa' | 'Contacto' | 'Ambiente'
export type SeveridadAlergia = 'Leve' | 'Moderada' | 'Grave'

export interface Alergia {
  id: number
  perfilPacienteId: number
  tipoAlergia: TipoAlergia
  descripcion: string
  severidad: SeveridadAlergia
  activa: boolean
  fechaDiagnostico?: string
  fechaCreacion: string
}

export interface CrearAlergiaPayload {
  tipoAlergia: TipoAlergia
  descripcion: string
  severidad: SeveridadAlergia
  fechaDiagnostico?: string
}

// ── Helpers ──────────────────────────────────────────────────

export const etiquetaTipoAlergia: Record<TipoAlergia, string> = {
  Alimentaria: 'Alimentaria',
  Medicamentosa: 'Medicamentosa',
  Contacto: 'Contacto',
  Ambiente: 'Ambiental',
}

export const etiquetaSeveridad: Record<SeveridadAlergia, string> = {
  Leve: 'Leve',
  Moderada: 'Moderada',
  Grave: 'Grave',
}

export const colorSeveridad: Record<SeveridadAlergia, string> = {
  Leve: 'var(--color-exito)',
  Moderada: 'var(--color-advertencia)',
  Grave: 'var(--color-error)',
}

// ── Endpoints ────────────────────────────────────────────────

export const obtenerAlergias = (perfilId: number) =>
  api.get<Alergia[]>(`/perfiles/${perfilId}/alergias`)

export const crearAlergia = (perfilId: number, datos: CrearAlergiaPayload) =>
  api.post<Alergia>(`/perfiles/${perfilId}/alergias`, datos)

export const actualizarAlergia = (perfilId: number, alergiaId: number, datos: Partial<CrearAlergiaPayload>) =>
  api.put<Alergia>(`/perfiles/${perfilId}/alergias/${alergiaId}`, datos)

export const desactivarAlergia = (perfilId: number, alergiaId: number) =>
  api.delete(`/perfiles/${perfilId}/alergias/${alergiaId}`)
