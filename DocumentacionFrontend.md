# Salud Conecta - Documentación del Proyecto

## 1. Descripción General

Salud Conecta es un centro de mando adaptativo para la gestión centralizada de historiales clínicos familiares. Permite que un administrador gestione perfiles de salud propios y de su círculo familiar, incluyendo antecedentes médicos, consultas, recetas, estudios clínicos y evolución biométrica.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | .NET (C#) | 9.0 |
| ORM | Entity Framework Core | 9.0.4 |
| Base de datos | MariaDB | 10.6+ |
| Frontend | React + Vite | - |
| Autenticación | JWT + HttpOnly Cookies | - |
| Hashing | BCrypt | - |
| IDE | Visual Studio Code | - |
| OS de desarrollo | Fedora Linux | - |
| Control de versiones | Git + GitHub | - |

---

## 3. Arquitectura

El proyecto sigue el patrón de Clean Architecture dividido en tres capas dentro de una misma solución .NET:

| Proyecto | Responsabilidad | Depende de |
|----------|----------------|------------|
| SaludConecta.Core | Entidades, enums, interfaces, excepciones | Nadie |
| SaludConecta.Infrastructure | DbContext, Fluent API, repositorios, servicios externos | Core |
| SaludConecta.API | Controllers, DTOs, servicios de negocio, middlewares | Core + Infrastructure |

La API está organizada por features (módulos funcionales), no por capa técnica. Cada módulo agrupa su controller, DTOs, validadores y servicio en una sola carpeta.

---

## 4. Base de Datos

18 tablas organizadas en módulos:

| Módulo | Tablas | Relación principal |
|--------|--------|-------------------|
| Autenticación | Usuarios, ProveedoresAutenticacion, RefreshTokens, CodigosVerificacion | Usuarios → todo |
| Perfiles | PerfilesPaciente | Usuarios → PerfilesPaciente |
| Biométricos | RegistrosBiometricos | PerfilesPaciente → registros acumulativos |
| Antecedentes | CatalogoCondicionesMedicas, AntecedentesPersonales, AntecedentesHeredofamiliares, AntecedentesPsicologicos | PerfilesPaciente → condiciones del catálogo |
| Estilo de vida | PerfilEstiloVida | PerfilesPaciente → 1:1 |
| Alergias | Alergias | PerfilesPaciente → múltiples alergias |
| Eventos quirúrgicos | EventosQuirurgicos | PerfilesPaciente → registros acumulativos |
| Consultas | Consultas | PerfilesPaciente → historial cronológico |
| Recetas | Recetas, MedicamentosReceta | Consultas → Recetas → Medicamentos |
| Estudios clínicos | EstudiosClinicos | Consultas → Estudios |
| Archivos | ArchivosAdjuntos | Vinculable a recetas, consultas o estudios |

---

## 5. Decisiones de Diseño Tomadas

| Decisión | Justificación |
|----------|--------------|
| Enums almacenados como string en BD | Legibilidad en consultas directas a la BD |
| Catálogo de condiciones médicas | Alimenta los checkboxes del wizard sin depender de strings sueltos |
| Antecedentes como registros (no booleans) | Permite agregar condiciones nuevas sin alterar el esquema |
| PerfilEstiloVida como relación 1:1 | Se actualiza en lugar de acumularse, a diferencia de los biométricos |
| RegistrosBiometricos como log temporal | Peso y talla cambian, se necesita el historial para graficar tendencias |
| EventosQuirurgicos como log temporal | Cirugías, hospitalizaciones e inmunizaciones se acumulan con el tiempo |
| Recetas con ConsultaId nullable | Una receta puede existir sin una consulta registrada en el sistema |
| ArchivosAdjuntos genérica | Una sola tabla vinculable a recetas, consultas o estudios, evita crear tabla por entidad |
| Archivos en carpeta local (uploads/) | Despliegue en servidor local, sin dependencia de servicios cloud |
| JWT en HttpOnly Cookies | Previene robo de tokens por XSS, invisible para JavaScript |
| Rotación de refresh tokens | Al refrescar, se revoca el actual y se genera uno nuevo |
| CORS con AllowCredentials | Necesario para que el navegador envíe las cookies al backend |
| Refresh token cookie con Path /api/auth | Solo se envía a endpoints de autenticación, no a toda la API |
| Background service para limpiar códigos de verificación | Limpia periódicamente los códigos expirados de la BD sin depender de Redis |
| Vistas SQL eliminadas del esquema | Se manejan con proyecciones LINQ en el código para mejor integración con EF |
| Sin Redis por ahora | Decisión de alcance, se integrará en una versión futura |

---

## 6. Estado Actual - Trabajo Completado

| Componente | Estado | Detalle |
|-----------|--------|---------|
| Base de datos (MariaDB) | ✅ Completo | 18 tablas creadas, datos semilla del catálogo de condiciones médicas insertados |
| Estructura del proyecto | ✅ Completo | Clean Architecture con tres proyectos, organización por features |
| Entidades (Core) | ✅ Completo | 18 entidades mapeando las 18 tablas |
| Enums (Core) | ✅ Completo | 16 enums cubriendo todos los tipos del dominio |
| Excepciones (Core) | ✅ Completo | NotFoundException, ConflictException, UnauthorizedException, BadRequestException |
| Interfaces de repositorios (Core) | ✅ Parcial | IRepositorioBase, IUsuarioRepository, IProveedorAutenticacionRepository, IRefreshTokenRepository |
| Interfaces de servicios (Core) | ✅ Parcial | IAuthService |
| DbContext (Infrastructure) | ✅ Completo | 18 DbSets configurados con ApplyConfigurationsFromAssembly |
| Fluent API (Infrastructure) | ✅ Completo | 18 archivos de configuración con todas las relaciones, índices y constraints |
| Repositorios (Infrastructure) | ✅ Parcial | RepositorioBase, UsuarioRepository, ProveedorAutenticacionRepository, RefreshTokenRepository |
| Paquetes NuGet | ✅ Completo | EF Core 9.0.4, Pomelo MySQL 9.0.0, EF Design 9.0.4, JWT Bearer 9.0.4, BCrypt |
| Auth - Registro local | ✅ Completo | Endpoint, servicio, hashing con BCrypt, tokens en HttpOnly cookies |
| Auth - Login local | ✅ Completo | Validación de credenciales, generación de tokens |
| Auth - Refresh token | ✅ Completo | Rotación de tokens, lectura desde cookie |
| Auth - Logout | ✅ Completo | Revocación de token y limpieza de cookies |
| Middleware de excepciones | ✅ Completo | Manejo global con mapeo a HTTP status codes |
| Configuración JWT | ✅ Completo | Lectura de token desde cookie, validación completa |
| CORS | ✅ Completo | Configurado para frontend local con credentials |
| Swagger | ✅ Completo | Documentación automática de endpoints |
| Frontend - Auth local | ✅ Completo | Registro y login conectados al backend |

---

## 7. Sprints de Trabajo Pendiente

### Sprint 1 — Funcionalidad Core

| Tarea | Prioridad | Módulo | Detalle |
|-------|-----------|--------|---------|
| CRUD de perfiles de paciente | Crítica | Perfiles | Crear, listar, editar, desactivar perfiles. Selector de perfil activo en modo familiar |
| Endpoint para cambiar modo Personal/Familiar | Crítica | Perfiles | Actualizar el modo del usuario y habilitar el selector de perfiles |
| CRUD de consultas | Crítica | Consultas | Crear, listar (timeline), editar, eliminar consultas médicas |
| CRUD de recetas | Crítica | Recetas | Crear recetas vinculadas o no a consultas, con medicamentos |
| CRUD de medicamentos de receta | Crítica | Recetas | Agregar, editar, desactivar medicamentos dentro de una receta |
| CRUD de estudios clínicos | Alta | Estudios | Crear, listar, editar estudios. Vinculable a consultas |
| Subida de archivos adjuntos | Alta | Archivos | Upload de imágenes/PDFs vinculados a recetas, consultas o estudios |
| Servir archivos con autorización | Alta | Archivos | Endpoint protegido que solo devuelve archivos del usuario autenticado |

### Sprint 2 — Historial Médico

| Tarea | Prioridad | Módulo | Detalle |
|-------|-----------|--------|---------|
| Wizard de antecedentes personales | Alta | Antecedentes | Flujo paso a paso con checkboxes del catálogo por categoría |
| Wizard de antecedentes heredofamiliares | Alta | Antecedentes | Mismo flujo, separado por parentesco (Padre, Madre, etc.) |
| CRUD de antecedentes psicológicos | Alta | Antecedentes | Agregar, editar, marcar activo/inactivo |
| CRUD de estilo de vida | Alta | Estilo de vida | Crear o actualizar el perfil de estilo de vida (relación 1:1) |
| CRUD de alergias | Alta | Alergias | Agregar, editar, desactivar alergias por tipo y severidad |
| CRUD de eventos quirúrgicos | Alta | Eventos | Registrar cirugías, traumatismos, hospitalizaciones, etc. |
| Indicador de completitud del perfil | Media | Perfiles | Porcentaje de perfil completado con accesos directos a secciones faltantes |

### Sprint 3 — Visualización y Monitoreo

| Tarea | Prioridad | Módulo | Detalle |
|-------|-----------|--------|---------|
| Registro de datos biométricos | Alta | Biométricos | Endpoint para registrar peso y estatura con fecha |
| Gráficas de evolución biométrica | Alta | Biométricos | Tendencias de peso y talla con Recharts en el frontend |
| Dashboard del paciente | Alta | Dashboard | Panel Bento Grid con resumen de línea de vida, medicamentos activos y biométricos |
| Línea de vida (timeline) | Alta | Consultas | Vista cronológica de consultas, diagnósticos y especialistas |
| Listado de medicamentos activos | Alta | Recetas | Vista de medicamentos vigentes con próxima toma calculada por FrecuenciaHoras |
| Recordatorio de actualización de datos | Media | Perfiles | Aviso cuando han pasado X días sin actualizar peso u otros datos variables |

### Sprint 4 — Autenticación Avanzada

| Tarea | Prioridad | Módulo | Detalle |
|-------|-----------|--------|---------|
| Login con Google OAuth | Alta | Auth | Flujo completo: botón en frontend → token de Google → validación en API → creación o vinculación de cuenta |
| Vincular cuenta Google a cuenta existente | Media | Auth | Un usuario local puede agregar Google como segundo método de login |
| Verificación de teléfono por SMS | Media | Auth | Envío de código por SMS (Twilio u otro), validación en API |
| Recuperación de contraseña por correo | Media | Auth | Envío de código al correo, validación y cambio de contraseña |
| Recuperación de contraseña por SMS | Media | Auth | Mismo flujo pero con el teléfono verificado |
| Cambio de contraseña desde la app | Media | Auth | Endpoint protegido para cambiar contraseña conociendo la actual |
| BackgroundService de limpieza de códigos | Baja | Auth | Job periódico que elimina códigos de verificación expirados |

### Sprint 5 — Notificaciones y Tiempo Real

| Tarea | Prioridad | Módulo | Detalle |
|-------|-----------|--------|---------|
| Tabla de notificaciones | Media | Notificaciones | Almacenar notificaciones pendientes y leídas |
| BackgroundService de generación de notificaciones | Media | Notificaciones | Revisa medicamentos próximos a tomar y citas próximas |
| Integración de SignalR (WebSocket) | Media | Notificaciones | Envío de notificaciones en tiempo real al usuario conectado |
| Notificación de cita un día antes | Media | Notificaciones | Detectar citas del día siguiente y notificar |
| Notificación de cita el mismo día | Media | Notificaciones | Recordatorio el mero día de la cita |
| Notificación de medicamento próximo | Media | Notificaciones | Aviso basado en FrecuenciaHoras del medicamento activo |
| Bandeja de notificaciones en frontend | Media | Notificaciones | Campanita con contador de no leídas, listado desplegable |

### Sprint 6 — Pulido y Extras

| Tarea | Prioridad | Módulo | Detalle |
|-------|-----------|--------|---------|
| Generación de historia clínica PDF | Baja | Reportes | Generar un documento PDF con toda la información del paciente |
| Extracción de texto de imágenes con IA | Baja | Estudios | OCR inteligente para extraer valores de resultados de laboratorio |
| Integración de Redis | Baja | Infraestructura | Caché del perfil activo, rate limiting, gestión de tomas precalculada |
| Onboarding progresivo | Baja | UX | Flujo de registro mínimo + indicador de progreso del perfil |
| Manejo de múltiples sesiones | Baja | Auth | Ver sesiones activas y cerrar sesiones remotas |
| Auditoría de accesos | Baja | Seguridad | Log de quién accedió a qué perfil y cuándo |

---

## 8. Repositorios

| Repositorio | Contenido |
|------------|-----------|
| SaludConecta-Backend | API .NET 9.0 con Clean Architecture |
| SaludConecta-Frontend | Aplicación React + Vite |

---

## 9. Configuración de Desarrollo

### Requisitos
- .NET 9.0 SDK
- MariaDB 10.6+
- Node.js (para el frontend)
- Visual Studio Code con extensión C#

### Usuario de base de datos
Se utiliza un usuario dedicado con permisos exclusivamente sobre la base de datos salud_conecta, no se usa root.

### Variables sensibles
Los datos sensibles (connection strings, JWT secret, credenciales de Google OAuth) se almacenan en appsettings.Development.json, el cual está excluido del repositorio por .gitignore.