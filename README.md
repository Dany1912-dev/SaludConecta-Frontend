# Salud Conecta — Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white&labelColor=20232A)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white&labelColor=1a1a2e)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white&labelColor=1a1a2e)
![License](https://img.shields.io/badge/license-MIT-4569AD?style=flat)

Interfaz de usuario de Salud Conecta, una aplicación web para gestionar de forma centralizada el historial médico personal y familiar.

> Repositorio del backend: [SaludConecta-Backend](https://github.com/tu-usuario/SaludConecta-Backend)

---

## Sobre el proyecto

La información médica vive fragmentada — recetas en cajones, resultados de laboratorio en fotos del celular, nombres de médicos en notas perdidas. En una emergencia, nadie recuerda qué medicamentos toma ni con qué especialista fue la última vez.

Salud Conecta resuelve eso. Permite registrar consultas, exámenes clínicos, recetas y medicamentos de cada miembro de la familia en un solo lugar, accesible en cualquier momento.

---

## Tech stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Routing | React Router v7 |
| Estado global | Zustand |
| Data fetching | TanStack Query (React Query) |
| HTTP client | Axios |
| Estilos | CSS Modules |
| Iconos | Lucide React |
| Gráficas | Recharts |
| Tipografía | DM Sans + DM Serif Display |

---

## Estructura del proyecto

```
src/
├── api/                        # Configuración de Axios y llamadas al backend
│   ├── axiosConfig.ts          # Instancia base con refresh automático de tokens
│   ├── authApi.ts
│   └── pacientesApi.ts
│
├── features/                   # Módulos por funcionalidad
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/              # useLogin, useRegistro
│   │   └── pages/              # LoginPage, RegistroPage
│   ├── landing/                # Página principal pública
│   ├── perfiles/               # Selector de paciente activo
│   ├── dashboard/
│   ├── lineaDeVida/
│   ├── medicamentos/
│   └── biometria/
│
├── store/                      # Estado global con Zustand
│   ├── authStore.ts            # Usuario autenticado
│   ├── pacienteStore.ts        # Paciente activo en contexto
│   └── temaStore.ts            # Modo claro / oscuro
│
├── router/
│   ├── AppRouter.tsx
│   └── PrivateRoute.tsx
│
├── shared/                     # Componentes y utilidades reutilizables
│   ├── components/
│   │   ├── ui/                 # Input, Boton, BotonTema
│   │   └── layout/
│   ├── hooks/
│   └── utils/
│
└── styles/
    └── variables.css           # Design tokens — colores, tipografía, espaciado
```

---

## Primeros pasos

### Requisitos

- Node.js 18 o superior
- El backend de Salud Conecta corriendo localmente

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/SaludConecta-Frontend.git
cd SaludConecta-Frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Edita el archivo `.env` con la URL de tu backend:

```env
VITE_API_URL=http://localhost:5000/api
```

### Desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.

### Build

```bash
npm run build
```

---

## Autenticación

La autenticación usa **HttpOnly Cookies** para almacenar el access token y el refresh token. JavaScript no puede leer estos tokens directamente — el navegador los envía automáticamente en cada petición. Esto elimina el riesgo de ataques XSS que roben credenciales desde `localStorage`.

El flujo de refresh es transparente: si una petición devuelve `401`, Axios reintenta automáticamente después de renovar el token, sin que el usuario lo note.

---

## Temas

La aplicación soporta modo claro y modo oscuro. La preferencia se guarda en `localStorage` y al iniciar respeta la configuración del sistema operativo del usuario. Todos los colores están definidos como variables CSS bajo `:root` y `[data-theme="dark"]`, por lo que cualquier componente nuevo hereda el tema automáticamente.

---

## Estado del proyecto

| Módulo | Estado |
|---|---|
| Landing page | Completo |
| Autenticación local (login / registro) | Completo |
| Google OAuth | Pendiente de backend |
| Selector de perfiles | Pendiente de backend |
| Dashboard | Pendiente de backend |
| Línea de vida | Pendiente de backend |
| Medicamentos | Pendiente de backend |
| Biometría | Pendiente de backend |

---

## Relacionado

- [SaludConecta-Backend](https://github.com/tu-usuario/SaludConecta-Backend) — API REST construida con .NET y MySQL