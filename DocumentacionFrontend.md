# Salud Conecta — Documentación de Proyecto

## Descripción general

Salud Conecta es una aplicación web para gestionar de forma centralizada el historial médico personal y familiar. Permite registrar consultas médicas, exámenes clínicos, recetas e información de medicamentos de cada miembro de la familia desde una sola cuenta.

El sistema está compuesto por dos repositorios independientes: un backend en .NET con MySQL y un frontend en React con TypeScript.

---

## Arquitectura general

| Capa | Tecnología | Repositorio |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | SaludConecta-Frontend |
| Backend | .NET + Clean Architecture | SaludConecta-Backend |
| Base de datos | MySQL / MariaDB | — |
| Autenticación | JWT + HttpOnly Cookies | Backend |

---

## Decisiones técnicas importantes

### Autenticación
Se usa el esquema de doble token con HttpOnly Cookies. El access token tiene vida corta y el refresh token se rota en cada uso. JavaScript no puede leer los tokens, lo que elimina el vector de ataque XSS desde localStorage. Si una petición devuelve 401, Axios reintenta automáticamente tras renovar el token sin intervención del usuario.

### Estado global (Frontend)
Zustand maneja tres stores independientes: `authStore` para el usuario autenticado, `pacienteStore` para el perfil activo en contexto, y `temaStore` para el tema visual. Esta separación evita rerenders innecesarios cuando solo cambia uno de los tres.

### Arquitectura frontend
Estructura orientada a features — cada módulo funcional tiene sus propios componentes, hooks y páginas. Los elementos reutilizables viven en `shared/`. Los estilos usan CSS Modules para evitar colisiones y mantener el CSS acoplado a su componente.

### Arquitectura backend
Clean Architecture con separación estricta entre capas: API, Core e Infrastructure. Las dependencias fluyen hacia adentro — los controladores dependen de interfaces, nunca de implementaciones concretas.

---

## Estado actual del proyecto

### Backend

| Módulo | Estado | Notas |
|---|---|---|
| Configuración base del proyecto | Completo | Clean Architecture, capas definidas |
| Entidades del dominio | Completo | Usuario, Paciente, Consulta, Receta, etc. |
| Configuración de base de datos | Completo | Entity Framework + MariaDB |
| Repositorios base | Completo | Patrón genérico + repositorios específicos |
| Manejo de excepciones | Completo | Middleware global + excepciones de negocio |
| Autenticación local (registro / login) | Completo | BCrypt + JWT + refresh token con rotación |
| HttpOnly Cookies | Completo | Access token + refresh token en cookies seguras |
| Google OAuth | Pendiente | — |
| Módulo de perfiles / pacientes | Pendiente | — |
| Módulo de consultas | Pendiente | — |
| Módulo de exámenes clínicos | Pendiente | — |
| Módulo de recetas | Pendiente | — |
| Módulo de medicamentos | Pendiente | — |

### Frontend

| Módulo | Estado | Notas |
|---|---|---|
| Configuración base del proyecto | Completo | Vite + React + TypeScript |
| Estructura de carpetas | Completo | Orientada a features |
| Design system (variables CSS) | Completo | Colores, tipografía, espaciado, sombras |
| Modo claro / oscuro | Completo | CSS variables + Zustand + persistencia en localStorage |
| Tipografía | Completo | DM Sans + DM Serif Display |
| Componente Input | Completo | Icono, toggle contraseña, manejo de errores |
| Componente Boton | Completo | Variantes primario, secundario, fantasma |
| Componente BotonTema | Completo | Toggle de tema reutilizable |
| Configuración de Axios | Completo | withCredentials + refresh automático ante 401 |
| authApi | Completo | login, registro, verificarSesion, logout |
| authStore | Completo | Usuario, estado de carga, inicialización |
| temaStore | Completo | Toggle, inicialización, persistencia |
| pacienteStore | Completo | Estructura lista, pendiente de conectar |
| AppRouter | Completo | Rutas públicas y protegidas |
| Landing page | Completo | 5 secciones + animaciones de scroll |
| Login page | Completo | Formulario + Google OAuth ready + animaciones |
| Registro page | Completo | Formulario + validación frontend + animaciones |
| Google OAuth (frontend) | Pendiente | Requiere endpoint en backend |
| Selector de perfiles | Pendiente | Requiere módulo de perfiles en backend |
| Dashboard | Pendiente | — |
| Línea de vida | Pendiente | — |
| Medicamentos | Pendiente | — |
| Biometría | Pendiente | — |

---

## Sprints pendientes

### Sprint 1 — Módulo de perfiles (Backend)

| Tarea | Prioridad |
|---|---|
| Endpoint GET /pacientes — listar perfiles del usuario | Crítico |
| Endpoint POST /pacientes — crear perfil (primer paciente en onboarding) | Crítico |
| Endpoint POST /pacientes — agregar familiar | Crítico |
| Endpoint PUT /pacientes/:id — editar perfil | Alta |
| Endpoint DELETE /pacientes/:id — eliminar perfil | Media |
| Definir lógica de Modo Personal vs Modo Familiar | Crítico |
| Validar que el primer perfil siempre sea el del usuario administrador | Alta |

### Sprint 2 — Onboarding y selector de perfiles (Frontend)

| Tarea | Prioridad |
|---|---|
| Flujo de onboarding tras el primer registro (crear perfil propio) | Crítico |
| Selector de perfiles — cuadrícula de avatares | Crítico |
| Lógica de cambio de contexto de paciente en pacienteStore | Crítico |
| Formulario para agregar familiar | Alta |
| Formulario para editar perfil | Alta |
| Lógica de Modo Personal (sin selector, entra directo al dashboard) | Alta |
| Lógica de Modo Familiar (muestra el selector de perfiles) | Alta |

### Sprint 3 — Google OAuth

| Tarea | Prioridad |
|---|---|
| Configurar proveedor Google en backend (.NET) | Crítico |
| Endpoint de callback OAuth | Crítico |
| Manejar caso: correo ya registrado con cuenta local | Alta |
| Conectar botón "Continuar con Google" en Login y Registro | Alta |
| Manejar redirección post-login desde OAuth | Alta |

### Sprint 4 — Dashboard y navegación

| Tarea | Prioridad |
|---|---|
| Layout principal — sidebar + navbar autenticada | Crítico |
| Dashboard con resumen del paciente activo | Crítico |
| Navegación entre secciones (Línea de vida, Medicamentos, Biometría) | Crítico |
| Componente de cambio de paciente activo desde el layout | Alta |
| Botón de cerrar sesión en el layout | Alta |
| Modo responsivo del layout | Media |

### Sprint 5 — Línea de vida (Consultas)

| Tarea | Prioridad |
|---|---|
| Endpoint POST /consultas — registrar cita | Crítico |
| Endpoint GET /consultas/:pacienteId — historial cronológico | Crítico |
| Endpoint PUT /consultas/:id — editar cita | Alta |
| Endpoint DELETE /consultas/:id | Media |
| Vista de historial cronológico en frontend | Crítico |
| Formulario de nueva consulta (doctor, especialidad, fecha, diagnóstico) | Crítico |
| Detalle de consulta expandible | Alta |

### Sprint 6 — Exámenes clínicos

| Tarea | Prioridad |
|---|---|
| Endpoint POST /examenes — registrar examen | Crítico |
| Endpoint GET /examenes/:pacienteId — listar por paciente | Crítico |
| Soporte para múltiples tipos (sangre, orina, etc.) | Alta |
| Vista de exámenes en frontend | Crítico |
| Formulario de nuevo examen | Crítico |
| Detalle del examen con resultados | Alta |

### Sprint 7 — Recetas

| Tarea | Prioridad |
|---|---|
| Endpoint POST /recetas — registrar receta con imagen | Crítico |
| Almacenamiento de imágenes (definir estrategia: local, S3, Cloudinary) | Crítico |
| Endpoint GET /recetas/:pacienteId | Crítico |
| Guardar nombre del doctor, especialidad y consultorio | Alta |
| Vista de recetas en frontend | Crítico |
| Subida y previsualización de imagen de receta | Alta |
| Endpoint DELETE /recetas/:id | Media |

### Sprint 8 — Medicamentos

| Tarea | Prioridad |
|---|---|
| Endpoint POST /medicamentos — registrar medicamento | Crítico |
| Endpoint GET /medicamentos/:pacienteId — listar activos e histórico | Crítico |
| Endpoint PUT /medicamentos/:id — marcar como finalizado | Alta |
| Vista de medicamentos en frontend | Crítico |
| Formulario de nuevo medicamento (nombre, dosis, frecuencia, motivo) | Crítico |
| Diferenciación visual entre medicamentos activos e histórico | Media |

### Sprint 9 — Biometría

| Tarea | Prioridad |
|---|---|
| Endpoint POST /biometria — registrar peso y talla | Crítico |
| Endpoint GET /biometria/:pacienteId — historial de registros | Crítico |
| Gráfica de evolución de peso con Recharts | Alta |
| Gráfica de evolución de talla | Alta |
| Cálculo automático de IMC | Media |
| Indicador visual de tendencia (sube, baja, estable) | Baja |

### Sprint 10 — Calidad y cierre

| Tarea | Prioridad |
|---|---|
| Manejo de errores global en frontend (toasts / notificaciones) | Alta |
| Estados de carga y skeletons en listas | Alta |
| Estados vacíos cuando no hay datos registrados | Alta |
| Validaciones de formulario consistentes en todo el frontend | Alta |
| Pruebas de flujo completo (registro → onboarding → dashboard) | Alta |
| Optimización de imágenes y performance | Media |
| Revisar accesibilidad básica (aria-labels, contraste) | Media |
| Variables de entorno para producción | Alta |
| Documentación de endpoints (Swagger) | Media |

---

## Flujo principal de la aplicación

```
Landing (/)
  └── Registro (/registro)
        └── Onboarding (crear perfil propio)
              ├── Modo Personal → Dashboard directo
              └── Modo Familiar → Agregar familiares → Selector de perfiles
                                                              └── Dashboard

Landing (/)
  └── Login (/login)
        ├── Modo Personal → Dashboard directo
        └── Modo Familiar → Selector de perfiles → Dashboard
```

---

## Variables de entorno

### Frontend (.env)

| Variable | Descripción | Ejemplo |
|---|---|---|
| VITE_API_URL | URL base del backend | http://localhost:5000/api |

### Backend (appsettings.json)

| Variable | Descripción |
|---|---|
| JwtSettings:SecretKey | Clave secreta para firmar JWT |
| JwtSettings:Issuer | Emisor del token |
| JwtSettings:Audience | Audiencia del token |
| JwtSettings:AccessTokenExpirationMinutes | Vida del access token |
| JwtSettings:RefreshTokenExpirationDays | Vida del refresh token |
| ConnectionStrings:DefaultConnection | Cadena de conexión a MariaDB |
| GoogleOAuth:ClientId | ID de cliente de Google |
| GoogleOAuth:ClientSecret | Secreto de cliente de Google |