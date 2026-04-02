import api from './axiosConfig'

// ---- Tipos ----

export interface AuthRespuesta {
  usuarioId: number
  nombre: string
  correo: string
  modo: 'Personal' | 'Familiar'
}

export interface LoginPayload {
  correo: string
  contrasena: string
}

export interface RegistroPayload {
  nombre: string
  correo: string
  contrasena: string
  telefono?: string
}

// ---- Endpoints ----

export const login = (datos: LoginPayload) =>
  api.post<AuthRespuesta>('/auth/login', datos)

export const registro = (datos: RegistroPayload) =>
  api.post<AuthRespuesta>('/auth/registro', datos)

// Se usa para verificar sesión activa al iniciar la app
export const verificarSesion = () =>
  api.post<AuthRespuesta>('/auth/refresh')

export const logout = () =>
  api.post('/auth/logout')