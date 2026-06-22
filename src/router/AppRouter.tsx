import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { usePerfilStore } from '../store/perfilStore'
import LandingPage from '../features/landing/LandingPage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegistroPage from '../features/auth/pages/RegistroPage'
import PerfilesPage from '../features/perfiles/pages/PerfilesPage'
import CrearPerfilPage from '../features/perfiles/pages/CrearPerfilPage'

const PlaceholderPage = ({ nombre }: { nombre: string }) => {
  const { usuario, logout } = useAuthStore()
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-fondo)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <span style={{ fontSize: '2.5rem' }}>🚧</span>
      <h2 style={{ color: 'var(--color-texto-principal)', fontSize: '1.25rem', fontWeight: 600 }}>
        {nombre}
      </h2>
      <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.875rem' }}>
        En construcción · Hola, <strong>{usuario?.nombre}</strong>
      </p>
      <button onClick={logout} style={{
        marginTop: '0.5rem', padding: '9px 20px',
        backgroundColor: 'var(--color-error)', color: '#fff',
        border: 'none', borderRadius: '10px', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit',
      }}>
        Cerrar sesión
      </button>
    </div>
  )
}

const RutaProtegida = ({ children }: { children: React.ReactNode }) => {
  const usuario = useAuthStore((s) => s.usuario)
  return usuario ? <>{children}</> : <Navigate to="/login" replace />
}

const RutaConPerfil = ({ children }: { children: React.ReactNode }) => {
  const usuario = useAuthStore((s) => s.usuario)
  const perfilActivo = usePerfilStore((s) => s.perfilActivo)
  if (!usuario) return <Navigate to="/login" replace />
  if (!perfilActivo) return <Navigate to="/perfiles" replace />
  return <>{children}</>
}

const RutaPublica = ({ children }: { children: React.ReactNode }) => {
  const usuario = useAuthStore((s) => s.usuario)
  return usuario ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

const AppRouter = () => (
  <BrowserRouter>
    <Routes>

      {/* Página principal pública */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login"    element={<RutaPublica><LoginPage /></RutaPublica>} />
      <Route path="/registro" element={<RutaPublica><RegistroPage /></RutaPublica>} />

      {/* Selector y creación de perfiles */}
      <Route path="/perfiles"       element={<RutaProtegida><PerfilesPage /></RutaProtegida>} />
      <Route path="/perfiles/crear" element={<RutaProtegida><CrearPerfilPage /></RutaProtegida>} />

      {/* Rutas protegidas con perfil activo */}
      <Route path="/dashboard"     element={<RutaConPerfil><PlaceholderPage nombre="Dashboard" /></RutaConPerfil>} />
      <Route path="/linea-de-vida" element={<RutaConPerfil><PlaceholderPage nombre="Línea de Vida" /></RutaConPerfil>} />
      <Route path="/medicamentos"  element={<RutaConPerfil><PlaceholderPage nombre="Medicamentos" /></RutaConPerfil>} />
      <Route path="/biometria"     element={<RutaConPerfil><PlaceholderPage nombre="Biometría" /></RutaConPerfil>} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  </BrowserRouter>
)

export default AppRouter