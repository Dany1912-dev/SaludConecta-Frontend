import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LandingPage from '../features/landing/LandingPage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegistroPage from '../features/auth/pages/RegistroPage'

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

      {/* Rutas protegidas */}
      <Route path="/perfiles"      element={<RutaProtegida><PlaceholderPage nombre="Selector de Perfiles" /></RutaProtegida>} />
      <Route path="/dashboard"     element={<RutaProtegida><PlaceholderPage nombre="Dashboard" /></RutaProtegida>} />
      <Route path="/linea-de-vida" element={<RutaProtegida><PlaceholderPage nombre="Línea de Vida" /></RutaProtegida>} />
      <Route path="/medicamentos"  element={<RutaProtegida><PlaceholderPage nombre="Medicamentos" /></RutaProtegida>} />
      <Route path="/biometria"     element={<RutaProtegida><PlaceholderPage nombre="Biometría" /></RutaProtegida>} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  </BrowserRouter>
)

export default AppRouter