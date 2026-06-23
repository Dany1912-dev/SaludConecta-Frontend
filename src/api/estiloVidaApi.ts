import api from './axiosConfig'

// ── Tipos ────────────────────────────────────────────────────

export type CalidadVida = 'Bueno' | 'Regular' | 'Malo'
export type CalidadAlimentacion = 'Buena' | 'Regular' | 'Mala'

export interface EstiloVida {
  id: number
  perfilPacienteId: number
  calidadVida?: CalidadVida
  horasSueno?: number
  calidadAlimentacion?: CalidadAlimentacion
  vasosAguaDiarios?: number
  actividadFisica?: string
  consumoAlcohol: string
  consumoDrogas: string
  tabaquismo: string
  medicamentosActuales: string
  zoonosis: string
  antecedentesLaborales: string
  fechaActualizacion: string
}

export interface GuardarEstiloVidaPayload {
  calidadVida?: CalidadVida
  horasSueno?: number
  calidadAlimentacion?: CalidadAlimentacion
  vasosAguaDiarios?: number
  actividadFisica?: string
  consumoAlcohol?: string
  consumoDrogas?: string
  tabaquismo?: string
  medicamentosActuales?: string
  zoonosis?: string
  antecedentesLaborales?: string
}

// ── Endpoints ────────────────────────────────────────────────

export const obtenerEstiloVida = (perfilId: number) =>
  api.get<EstiloVida>(`/perfiles/${perfilId}/estilo-vida`)

export const guardarEstiloVida = (perfilId: number, datos: GuardarEstiloVidaPayload) =>
  api.put<EstiloVida>(`/perfiles/${perfilId}/estilo-vida`, datos)
