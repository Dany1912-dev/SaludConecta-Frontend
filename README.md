# SaludConecta — Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232A)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Estado](https://img.shields.io/badge/estado-en_desarrollo-yellow)]()

> Repositorio del backend: [SaludConecta-Backend](https://github.com/Dany1912-dev/SaludConecta-Backend)

---

## La idea

La información médica personal vive fragmentada: recetas en cajones, resultados de laboratorio en fotos del celular, el nombre del especialista anotado en alguna hoja perdida. En una emergencia, nadie recuerda qué medicamentos toma, qué alergias tiene ni cuándo fue la última consulta.

**SaludConecta** es una cartilla médica digital personal. Permite registrar y centralizar todo el historial clínico propio y el de la familia en un solo lugar. En caso de urgencia, se puede generar un resumen o descarga del historial completo en segundos.

---

## Estado actual

El proyecto está iniciado. La landing, el login y el registro funcionan y se conectan al backend. El resto de los módulos están estructurados pero pendientes de implementar.

| Módulo | Estado |
|--------|--------|
| Landing page | ✅ Completo |
| Login y registro | ✅ Completo |
| Modo claro / oscuro | ✅ Completo |
| Google OAuth | ⏳ Pendiente de backend |
| Selector de perfiles familiares | ⏳ Pendiente |
| Dashboard principal | ⏳ Pendiente |
| Línea de vida (historial cronológico) | ⏳ Pendiente |
| Medicamentos y recetas | ⏳ Pendiente |
| Biometría (peso, estatura) | ⏳ Pendiente |
| Estudios clínicos | ⏳ Pendiente |
| Calendario y recordatorios | ⏳ Pendiente |
| Exportar historial clínico | ⏳ Pendiente |

---

## Estructura del proyecto

```
src/
├── api/
│   ├── axiosConfig.ts          # Instancia Axios: cookies, refresh automático en 401
│   └── authApi.ts              # Llamadas al módulo de autenticación
│
├── features/                   # Un directorio por módulo funcional
│   ├── auth/
│   │   ├── hooks/              # useLogin, useRegistro
│   │   └── pages/              # LoginPage, RegistroPage
│   ├── landing/                # Página principal pública
│   ├── perfiles/               # Selector de paciente activo (pendiente)
│   ├── dashboard/              # (pendiente)
│   ├── lineaDeVida/            # Historial cronológico (pendiente)
│   ├── medicamentos/           # (pendiente)
│   └── biometria/              # (pendiente)
│
├── store/                      # Estado global con Zustand
│   ├── authStore.ts            # Usuario autenticado
│   ├── pacienteStore.ts        # Paciente activo en contexto
│   └── temaStore.ts            # Modo claro / oscuro
│
├── router/
│   ├── AppRouter.tsx
│   └── PrivateRoute.tsx        # Protección de rutas autenticadas
│
├── shared/
│   ├── components/ui/          # Input, Boton, BotonTema — componentes reutilizables
│   └── hooks/
│
└── styles/
    └── variables.css           # Design tokens: colores, tipografía, espaciado
```

---

## Autenticación

Las cookies **HttpOnly** almacenan el access token y el refresh token — JavaScript nunca los toca directamente. El navegador los adjunta automáticamente en cada petición al backend.

Cuando llega un `401`, el interceptor de Axios intenta renovar el token llamando a `/api/auth/refresh` antes de reintentar la solicitud original. Si hay múltiples peticiones simultáneas que fallan con 401, solo una lanza el refresh; las demás se encolan y se resuelven cuando el refresh termina. Si el refresh también falla, se despacha el evento `sc:sesion-expirada` para limpiar la sesión y redirigir al login.

---

## Temas

La app soporta modo claro y oscuro. Al iniciar respeta la preferencia del sistema operativo; después la preferencia manual se guarda en `localStorage`. Todos los colores son variables CSS definidas en `styles/variables.css` bajo `:root` y `[data-theme="dark"]`, por lo que cualquier componente nuevo hereda el tema sin configuración extra.

---

## Primeros pasos

**Requisitos:**
- Node.js 18+
- El backend corriendo en local

**Instalación:**

```bash
git clone https://github.com/Dany1912-dev/SaludConecta-Frontend.git
cd SaludConecta-Frontend
npm install
```

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:5247/api
```

**Desarrollo:**

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Tech stack

| | Tecnología |
|--|--|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 |
| Estado global | Zustand 5 |
| Data fetching | TanStack Query v5 |
| HTTP | Axios |
| Estilos | CSS Modules + variables CSS |
| Iconos | Lucide React |
| Gráficas | Recharts |
